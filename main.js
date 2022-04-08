auto.waitFor();
var appName = "美团买菜";
launchApp(appName);
PACKAGE_NAME = "com.meituan.retail.v.android";
waitForPackage(PACKAGE_NAME, 100);

HOME_ACTIVATY = "com.meituan.retail.c.android.newhome.newmain.NewMainActivity";
MRN_ACTIVATY = "com.meituan.retail.c.android.mrn.mrn.MallMrnActivity";

cart_count = 0;
function main() {
  skip_ad();
  goto_cart();

  while (1) {
    sleep(300);
    if (currentPackage() != PACKAGE_NAME) continue;

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
          ret.parent().click() ||
            click(ret.bounds().centerX(), ret.bounds().centerY());
        }
        break;

      case "BUSY":
        var ret = textContains("返回购物车").findOne(100);
        if (ret) {
          ret.parent().click() ||
            click(ret.bounds().centerX(), ret.bounds().centerY());
        }
        break;

      case "READY_TO_PAY_SELF":
      case "READY_TO_PAY":
        pay();
        break;

      case "SUCCESS":
        toast("成功");
        device.vibrate(1500);
        break;

      default:
        var ret =
          textContains("我知道了").findOnce() ||
          textContains("返回购物车").findOnce() ||
          text("确定").findOnce();
        if (ret) {
          ret.parent().click() ||
            click(ret.bounds().centerX(), ret.bounds().centerY());
        }
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
  var cart_btn = id("img_shopping_cart").findOne(1000);
  if (cart_btn) {
    cart_btn.parent().click();
  }
}
function set_full_selection() {}

function getCurrentState() {
  var state = null;
  var cur_ac = currentActivity();
  if (
    textContains("当前不在可下单时段")
      .boundsInside(0, device.height / 4, device.width, device.height)
      .exists()
  ) {
    state = "TIME_NOT_AVAILABLE";
  } else if (textContains("结算(").exists()) {
    //cur_ac == HOME_ACTIVATY &&
    state = "CART";
  } else if (textContains("已为您移除该商品").exists()) {
    state = "REMOVE";
  } else if (
    cur_ac == MRN_ACTIVATY &&
    (textContains("运力已约满").exists() || textContains("订单已约满").exists())
  ) {
    state = "FULL";
  } else if (cur_ac == MRN_ACTIVATY && textContains("前方拥堵").exists()) {
    state = "BUSY";
  } else if (cur_ac == MRN_ACTIVATY && textContains("该时段已约满").exists()) {
    state = "TIME_NOT_AVAILABLE";
  } else if (
    cur_ac == MRN_ACTIVATY &&
    textContains("站点自提").exists() &&
    textContains("极速支付").exists()
  ) {
    state = "READY_TO_PAY_SELF";
  } else if (cur_ac == MRN_ACTIVATY && textContains("极速支付").exists()) {
    state = "READY_TO_PAY";
  } else if (cur_ac == MRN_ACTIVATY && textContains("支付成功").exists()) {
    state = "SUCCESS";
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
  var quick_pay_btn = text("极速支付")
    .boundsInside(0, (device.height * 3) / 4, device.width, device.height)
    .findOne(1000); //这里需要修改，因为有两个极速支付的地方
  if (quick_pay_btn) {
    quick_pay_btn.parent().click();
    // click(quick_pay_btn.bounds().centerX(), quick_pay_btn.bounds().centerY());
  }
}

main();
