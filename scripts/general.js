//$('.icFiltr').on('click touch', function(){
	window.onload = function() {
		$('.icFiltr').on('click touch', function(){
  //$('.filtersMenu').css("display", "block");
  $('.filtersMenu').toggleClass("filtersMenuAct");
  })
	}
//});

$(document).click(function(event) {
  if (!$(event.target).closest(".filtersMenu, .icFiltr").length) {
    $('.filtersMenu').removeClass("filtersMenuAct");
  }
});
