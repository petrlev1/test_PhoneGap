//$('.icFiltr').on('click touch', function(){
	window.onload = function() {
		
		/* $('.icFiltr').on('click touch', function(){
  //$('.filtersMenu').css("display", "block");
  $('.filtersMenu').toggleClass("filtersMenuAct");
  }) */
  
  $('.icFiltr').on('click touch', function(){
  //$('.filtersMenu').css("display", "block");
  $('.filtersMenu2').toggleClass("filtersMenuAct");
  $(this).toggleClass("icFiltrAct");
  $('.inputSearchDown').removeClass("filtersMenuAct");
  })

$('.inputSearchInput').on('click touch', function(){
  $('.inputSearchDown').addClass("filtersMenuAct");
  })
  
  $('.inputSearchBut1').on('click touch', function(){
  $('.inputSearchDown').removeClass("filtersMenuAct");
  })
  
  $('.productItem1But').on('click touch', function(){
  $('.filtersMenu').removeClass("filtersMenuAct");
  })

/* $('#inputSearchBut1').on('click touch', function(){
  alert("Поиск работает");
  }) */
  
  $('#filtersBot').on('click touch', function(){
  alert("Фильры работают");
  })
  
  
  //DopMenu
  $('.icDopMenu').on('click touch', function(){
  $('.DopMenu').show();
  })
  
  $('.DopMenu a').on('click touch', function(){
  $('.DopMenu').hide();
  })
  
  
}



$(document).click(function(event) {
  if (!$(event.target).closest(".filtersMenu2, .icFiltr").length) {
    $('.icFiltr').removeClass("icFiltrAct");
	$('.filtersMenu2').removeClass("filtersMenuAct");
  }
});

$(document).click(function(event) {
  if (!$(event.target).closest(".inputSearch").length) {
    $('.inputSearchDown').removeClass("filtersMenuAct");
  }
  
});






//DopMenu
$(document).click(function(event) {
  if (!$(event.target).closest(".icDopMenu").length) {
    $('.DopMenu').hide();
  } 
  
});
