auto.waitFor();
var appName = "美团买菜";
launchApp(appName);
waitForPackage("com.meituan.retail.v.android", 100);
sleep(1000);

HOME_ACTIVATY = "com.meituan.retail.c.android.newhome.newmain.NewMainActivity";
MRN_ACTIVATY = "com.meituan.retail.c.android.mrn.mrn.MallMrnActivity";

cart_count = 0;
function main() {
  skip_ad();
  goto_cart();

  while (1) {
    sleep(300);
    cur_state = getCurrentState();

    switch (cur_state) {
      case "CART":
        var post_btn = textContains("结算").findOne(100);
        if (post_btn) {
          post_btn.parent().click();
        } else {
          toast("stall");
          refresh_cart();
        }
        break;

      case "REFRESH":
        refresh_cart();
        break;

      case "TIME_NOT_AVAILABLE":
      case "REMOVE":
      case "FULL":
        var ret = textContains("我知道了").findOne(100);
        if (ret) {
          //   ret.parent().click();
          click(ret.bounds().centerX(), ret.bounds().centerY());
        }
        break;

      case "BUSY":
        var ret = textContains("返回购物车").findOne(100);
        if (ret) {
          //   ret.parent().click();
          click(ret.bounds().centerX(), ret.bounds().centerY());
        }
        break;

      case "READY_TO_PAY":
        pay();
        break;
    }
  }
}

function refresh_cart() {
  gesture(
    200,
    [device.width / 2, device.height / 4],
    [device.width / 2, device.height / 2]
  );
  toast("refresh");
}

function skip_ad() {
  var skip_btn = id("btn_skip").findOne(200);
  if (skip_btn) {
    skip_btn.click();
  }
}

function goto_cart() {
  var cart_btn = id("img_shopping_cart").findOne(200);
  if (cart_btn) {
    cart_btn.parent().click();
  }
}
function set_full_selection() {}

function getCurrentState() {
  var state = null;
  var cur_ac = currentActivity();
  if (textContains("结算").exists()) {
    //cur_ac == HOME_ACTIVATY &&
    state = "CART";
  } else if (textContains("已为您移除该商品").exists()) {
    state = "REMOVE";
  } else if (cur_ac == MRN_ACTIVATY && textContains("运力已约满").exists()) {
    state = "FULL";
  } else if (cur_ac == MRN_ACTIVATY && textContains("前方拥堵").exists()) {
    state = "BUSY";
  } else if (cur_ac == MRN_ACTIVATY && textContains("该时段已约满").exists()) {
    state = "TIME_NOT_AVAILABLE";
  } else if (cur_ac == MRN_ACTIVATY && textContains("极速支付").exists()) {
    state = "READY_TO_PAY";
  }
  cart_count = state == "CART" ? cart_count + 1 : 0;
  if (cart_count >= 5) {
    state = "REFRESH";
    cart_count = 0;
  }
  toast(state);
  return state;
}

function pay() {
  //   if (setInf) {
  //     setText(0, setName);
  //     text(setSex).findOne().parent().click();
  //     setText(1, setPhone);
  //   }
  var quick_pay_btn = text("极速支付").findOne(1000); //这里需要修改，因为有两个极速支付的地方
  if (quick_pay_btn) {
    quick_pay_btn.parent().click();
  }
}

main();
