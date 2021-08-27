$(document).ready(function () {
  // 팝업 닫기
  $(".popup_confirm, .popup_close, .pop_btn_close, .pop_btn_cancle").on(
    "click",
    function () {
      if ($(this).hasClass("noAutoClose")) return;
      $(this).parents(".popup").hide();
    }
  );

  // 팝업 - 공유하기
  $(".btn_share").on("click", function () {
    $(".popup_share").show();
  });
  // 팝업 - 교통안내
  $(".btn_traffic").on("click", function () {
    $(".popup_guideTraffic").show();
  });
  // 팝업 - 주차안내
  $(".btn_park").on("click", function () {
    $(".popup_guidePark").show();
  });
  // 팝업 - 네비게이션
  $(".btn_navi").on("click", function () {
    $(".popup_guideNavi").show();
  });
  // 팝업 - 조문메시지 작성
  $(".btn_write").on("click", function () {
    $(".popup_message").show();
  });
  // 팝업 - 계좌 정보를 받기 위한 정보 입력
  $(".btn_reception").on("click", function () {
    $(".popup_getAccount").show();
  });

  //input 숫자만 입력
  $(document).on("keyup", "input:text[numberOnly]", function () {
    $(this).val(
      $(this)
        .val()
        .replace(/[^0-9]/gi, "")
    );
  });

  // 사업자정보
  $(".btn_toggle").on("click", function () {
    $(this).toggleClass("on");
    $(".cp_toggle_con").stop().slideToggle(300);
  });

  // 탭메뉴 - 근조화환
  $(".tab_wreath > ul > li").click(function () {
    $(".tab_wreath > ul > li").removeClass("on");
    $(".tab_wreath > .tabContent").removeClass("on");

    $(this).addClass("on");

    $("#" + $(this).data("id")).addClass("on");
  });

  // 탭메뉴 - 주문·배송 안내
  $(".tab_delivery > ul > li").click(function () {
    $(".tab_delivery > ul > li").removeClass("on");
    $(".tab_delivery > .tabContent").removeClass("on");

    $(this).addClass("on");

    $("#" + $(this).data("id")).addClass("on");
  });

  // 근조화환 - 주문배송안내
  $(".btn_delivery_guide").on("click", function () {
    $(".popup_delivery").show();

    $(".popup_delivery > ul > li").eq(0).addClass("on");
    $(".popup_delivery > .tabContent").eq(0).addClass("on");
  });

  // 주문정보입력 - 화환 리본 문구
  $("#ribbonText").change(function () {
    if ($("#ribbonText").val() == "직접입력") {
      $(".directInput").show();
    } else {
      $(".directInput").hide();
    }
  });

  // 팝업 - 상주변경
  $(".btn_changeResident").on("click", function () {
    $(".popup_changeResident").show();
  });
  // 팝업 - 리본 예시
  $(".btn_ribbonEx").on("click", function () {
    $(".popup_ribbonEx").show();
  });

  // 검색 -  더보기
  var resultDivHeight = $(".tbl_result").height();
  var resultTableHeight = $(".tbl_result > table").height();
  if (resultDivHeight > resultTableHeight) {
    $(".btn_more").addClass("on");
  } else {
    $(".btn_more").removeClass("on");
  }
  $(".btn_more").on("click", function () {
    $(this).addClass("on");
    $(".tbl_result").addClass("on");
  });
  // 검색 - 검색 결과가 없습니다.
  var isVisible = $(".noResult").css("display") == "table-cell";
  if (isVisible == true) {
    $(".btn_more").addClass("on");
  }

  // 탭메뉴 - 리본 예시
  $(".tab_ex_ribbon > ul > li").on("click", function () {
    $(".tab_ex_ribbon > ul > li").removeClass("on");
    $(".tab_ex_ribbon > .tabContent").removeClass("on");

    $(this).addClass("on");

    $("#" + $(this).data("id")).addClass("on");

    changeIMG();
  });
  function changeIMG() {
    if ($("#ribbon2").hasClass("on")) {
      $(".exRibbon_img").attr("src", "/img/ribbon2.png");
    } else if ($("#ribbon3").hasClass("on")) {
      $(".exRibbon_img").attr("src", "/img/ribbon3.png");
    } else {
      $(".exRibbon_img").attr("src", "/img/ribbon1.png");
    }
  }

  // 탭메뉴 - 결제수단
  $(".tab_method > ul > li").click(function () {
    $(".tab_method > ul > li").removeClass("on");
    $(".tab_method > .tabContent").removeClass("on");

    $(this).addClass("on");

    $("#" + $(this).data("id")).addClass("on");

    if ($("#method_card").hasClass("on")) {
      // PG 이동
    } else if ($("#method_bank").hasClass("on")) {
      // $(".btn_pay").on("click", function () {
      //   location.href = "payment_bank.html";
      // });
    } else if ($("#method_easyPay").hasClass("on")) {
      // 선택한 간편 결제 수단으로 이동
    }
  });

  // 결제수단 이용안내
  $(".btn_useInfo").on("click", function () {
    $(".useInfo").toggleClass("on");
  });

  // 결제 진행 필수 동의
  $(".toggle_agree").on("click", function () {
    $(".terms_con").toggleClass("on");
  });

  // 무통장입금
  $("input:checkbox.chk_apply").on("click", function () {
    if ($(this).is(":checked") == true) {
      $(this).siblings(".hide_box").show();
    } else {
      $(this).siblings(".hide_box").hide();
    }
  });

  // 팝업 - 가상계좌 전송 수신방법
  $(".btn_finished").on("click", function () {
    $(".popup_receive").show();
  });
});
