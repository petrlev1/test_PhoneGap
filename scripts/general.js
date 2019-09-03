//$('.icFiltr').on('click touch', function(){
	window.onload = function() {
		
		$('.icFiltr').on('click touch', function(){
  //$('.filtersMenu').css("display", "block");
  $('.filtersMenu').toggleClass("filtersMenuAct");
  })
  
  $('#inputSearch').on('click touch', function(){
  $('.inputSearchDown').addClass("filtersMenuAct");
  })
  
  $('#inputSearchBut1').on('click touch', function(){
  $('.inputSearchDown').removeClass("filtersMenuAct");
  })
  
  $('.productItem1But').on('click touch', function(){
  $('.filtersMenu').removeClass("filtersMenuAct");
  })

$('#inputSearchBut1').on('click touch', function(){
  alert("Поиск работает");
  })
  
  $('#filtersBot').on('click touch', function(){
  alert("Фильры работают");
  })
  
	}
//});

$(document).click(function(event) {
  if (!$(event.target).closest(".filtersMenu, .icFiltr").length) {
    $('.filtersMenu').removeClass("filtersMenuAct");
  }
});

$(document).click(function(event) {
  if (!$(event.target).closest(".inputSearch").length) {
    $('.inputSearchDown').removeClass("filtersMenuAct");
  }
  
});
