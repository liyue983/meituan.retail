auto.waitFor();
var appName = "美团买菜";
launchApp(appName);
sleep(1000);

HOME_ACTIVATY = "com.meituan.retail.c.android.newhome.newmain.NewMainActivity";
MRN_ACTIVATY = "com.meituan.retail.c.android.mrn.mrn.MallMrnActivity";

function skip_ad() {
  var skip_btn = id("btn_skip").findOne(1000);
  if (skip_btn) {
    skip_btn.click();
  }
}

function getCurrentState() {
  var state = null;
  var cur_ac = currentActivity();
  if (cur_ac == HOME_ACTIVATY && textContains("结算").exists()) {
    state = "CART";
  } else if (cur_ac == MRN_ACTIVATY && textContains("运力已约满").exists()) {
    state = "FULL";
  } else if (cur_ac == MRN_ACTIVATY && textContains("前方拥堵").exists()) {
    state = "BUSY";
  } else if (cur_ac == MRN_ACTIVATY && textContains("该时段已约满").exists()) {
    state = "TIME_NOT_AVAILABLE";
  } else if (cur_ac == MRN_ACTIVATY && textContains("极速支付").exists()) {
    state = "READY_TO_PAY";
  }
  toast(state);
  return state;
}

function main() {
  skip_ad();
  cart_btn = id("img_shopping_cart").findOne().parent().click();
  while (1) {
    sleep(500);
    cur_state = getCurrentState();
    switch (cur_state) {
      case "CART":
        var post_btn = textContains("结算").findOne(100);
        if (post_btn) {
          post_btn.parent().click();
        }
        break;
      case "FULL":
        break;
      case "BUSY":
        break;
      case "TIME_NOT_AVAILABLE":
        break;
      case "READY_TO_PAY":
        break;
    }
  }
}

main();
// function pay(
//   setInf = false,
//   name = "李先生",
//   sex = "先生",
//   phone = ""
// ) {
//   if (setInf) {
//     setText(0, name);
//     text(sex).findOne().parent().click();
//     setText(1, phone);
//   }
//   var quick_pay_btn = text("极速支付").findOne();#这里需要修改，因为有两个极速支付的地方
//   if (quick_pay_btn) {
//     quick_pay_btn.click();
//   }
// }
