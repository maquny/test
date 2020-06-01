/*
	funyalert 공용 알럿창 ver0.9
	developer: 김훈(kim fun)
	
	** 개발목표 **
	최대한 쉽게, 범용성은 넓게, 여러 상황에 대처할수 있는 커스텀 알럿창을 만들어보자가 목표입니다.
	또한 커스텀도 그나마 쉽게 할수 있도록 구성해놨기때문에 몇가지만 손보시면 꽤 많은 형태로 커스텀이 가능하다고 생각합니다.

	** option information **
	- targetBtn: 클릭할 대상 객체이며 클래스만 사용가능합니다. 클래스만 받는 이유는 범용성이 넓히기 위해서 입니다.
	  			 전달 받음 값중 targetBtn이 없을 경우 레이어팝업이 바로 노출됨니다.
	- targetActionType : 기본 layer타입. / toastmessage 일경우 최우선으로 노출됩니다.
	- contTitle: 타이틀이 전달받은 값이 없을 경우 상단 타이틀바도 존재하지 않게 됨니다.
	- contTextType : 1 alert 타입 , 2 html 타입.
	- text: contTextType의 값이 1일 경우 동작.
	- contHtml: contTextType의 값이 2일 경우 동작.
	- textArea: 텍스트 정렬.
	- btn: 버튼의 제목.
	       버튼은 최대 3개까지 가능하며 버튼이 존재하지 않으면 노출되지 않습니다.
	       기존은 왼쪽이 네이티브로 지정되어 있습니다.
	- negativeDirection: 기본은 네이티브가 왼쪽이지만 오른쪽으로 지정할 수 있습니다.
	- centerCallName: 버튼클릭시 콜백받을수 있는 값은 ok, cancel, center 그중 center의 콜백값을 변경할 수 있습니다.
	                  다만 center의 명칭 콜백값 변경은 현재 left, right로만 가능합니다.
	- btnActivePriority: 현재 버전에서는 사용 용도가 명확하지 않습니다.  
	- uiType: 레이어팝업이 노출될때 시작 포인트 지점을 뜻합니다.
	          center, top, bottom 3가지 시작포인트를 가지고 있습니다.
	          기본적으로 center에는 애니효과를 지원하지 않습니다.
	- backgroundState: 백그라운드의 bg유무를 지정할 수 있습니다.
	- backgroundClickClose: 백그라운드클릭시에도 닫히게 끔 지정할 수 있습니다.
	                        bg클릭후 닫힐때 콜백은 cancel입니다.
	- callback: 현재 버전에서는 큰의미가 없어 졌습니다.
	- topHeaderState: 타이틀의 존재여부를 지정할 수 있습니다.
	- topCloseState: 타이틀부분의 x버튼의 존재 여부를 지정할 수 있습니다.
	- btnAreaState: 현재 버전에서는 사용 용도가 명확하지 않습니다.
	- setTimeOut: 현재 버전에서는 큰의미가 없어 졌습니다.
	- alertBoxWidth: 레이어팝업의 넓이를 지정할 수 있습니다.
	                 기본값은 브라우져의 넓이의 90%이며, 1 = 10%입니다.
	- btnNotClose: true 지정하면 레이어팝업은 닫히지 않습니다.
	- setTimeoutVal: 이벤트발생 시간을 지정할 수 있습니다.
	- animationUi: 이벤트 발생시 애니메이션 효과 / false 애니메이션 효과 삭제
	** option information **
	
*/

var funyAlert = {
	initOption: {
		targetBtn: '',//클릭이벤트 객체
		targetContents: 'funy_layerpopup',//타겟 컨텐츠 $추후 개발될 기능에 필요함
		targetActionType: 'layer', //layer, toastmessage//toastmessage 일경우 최우선
		contTitle: '',//타이틀
		contTextType: 1,//1 alert 타입 , 2 html 타입
		text: '',//contTextType의 값이 1일 경우 동작
		contHtml: '',//contTextType의 값이 2일 경우 동작
		textArea: 'center',
		btn: '',//왼쪽 버튼 이름
		negativeDirection: 'left',//left = 왼쪽버튼이 cancel, right = 오른쪽이 cancel, 버튼이 한개일경우
		centerCallName: 'center',//콜백 받을 수 있는 값은 현재 버전에서는 3가지(ok, cancel, center) 입니다.
		btnActivePriority: false,
		uiType: 'center',//center, top, bottom 3가지 ui
		backgroundState: true,//백그라운드 bg 유무 // 해당 클래스 "border_line"
		backgroundClickClose: false,//백그라운드 클릭시 닫기 초기 비활성화
		callback: null,//기본 콜백은 null
		topHeaderState: true,//contTitle 존재 유무
		topCloseState: true,//contTitle x 버튼 존재 유무
		btnAreaState: true,// 현재 기능없음
		setTimeOut: undefined,//즉시 실행할 경우 ui 액션관련
		alertBoxWidth: 9,//컨텐츠 넓이  
		btnNotClose: false,//버튼 종류를 클릭 후 closeActionEvent 이벤트 발생안함
		setTimeoutVal: 700,
		animationUi: true,
	},

	funyDataAlert: function(name, params, callbackal){
		var data = new Object();//새로운 데이터 생성
		var initialValue = '';//uitype 저장
		var otherValue = '';
		data.name = name;//데이터의 이름
		data.params = params;//데이터의 값
		Objectlength = Object.keys(data.params).length; //전달받은 데이터의 obj 갯수
		keyparamsName = new Array();//전달받은 데이터의 obj 속성네임 담을 그릇
		originalObjectlength = Object.keys(funyAlert.initOption).length; //original 데이터의 obj갯수
		originalkeyparamsName = new Array();//original 데이터의 obj 속성네임 담을 그릇

		var parn = 0;
		var oparn = 0;

		//obj의 속성네임
		for( var key in data.params ) keyparamsName[parn++] = key;
		//obj의 속성네임
		for( var key in funyAlert.initOption ) originalkeyparamsName[oparn++] = key;
		//전달받은 값과 기본 값을 비교
		//값이 없을 경우 기본값으로 대체
		for(var i = 0; i < originalObjectlength; i++){
			if(data.params[originalkeyparamsName[i]] == undefined || data.params[originalkeyparamsName[i]] == null ){
				data.params[originalkeyparamsName[i]] = funyAlert.initOption[originalkeyparamsName[i]];
			}
		}
		//타이틀, 버튼, 닫기버튼이 없을때 팝업창을 닫을수 있는 기능이 없기때문에 강제로 topHeaderState 값은 false로 변경됨니다.
		//변경되면 bg클릭시 닫히게 됨니다.
		if(data.params.btn.length == 0 && data.params.topCloseState == false && data.params.contTitle == '') data.params.topHeaderState = false;
		
		funyalert(name, data.params, callbackalert = {
			ok: function(){
				if($.isFunction(window[name]) != false){
					window[name]('ok');
				} else {
					console.log('콜백받을 함수가 존재하지 않습니다.');
				}
			},
			cancel: function(){
				if($.isFunction(window[name]) != false){
					window[name]('cancel');
				} else {
					console.log('콜백받을 함수가 존재하지 않습니다.');
				}
			},
			center: function(){
				if($.isFunction(window[name]) != false){
					window[name]('center');
				} else {
					console.log('콜백받을 함수가 존재하지 않습니다.');
				}
			},
			toCancel: function(){
				if($.isFunction(window[name]) != false){
					window[name]('toCancel');
				} else {
					console.log('콜백받을 함수가 존재하지 않습니다.');
				}
			}
		});
	}, 
}

function funyalert(name, params, callBackFunc){

	var funy_layerpopup = {
		init: function(){//초기
			//아직 업데이트 대기
		},

		dynamicUI: function(){//UI담당자 
			var header = '';
			var content = '';
			var btnArea = '';
			var container = '';
			var lyBody = '';
			//중복방지
			//똑같은 아이디로 팝업이 생성될 경우 기존 레이어팝업창을 삭제 시킴니다.
			if($('#'+name).html() != null && $('#'+name).html() != '' && $('#'+name).html() != undefined) $('#'+name).remove();
			if(params.topHeaderState == true || params.topCloseState == true || params.contTitle == ''){
				if(params.targetActionType != 'toastmessage'){//targetActionType일경우 최우선이 됨
					if(params.topHeaderState == false && params.topCloseState == true || params.contTitle == ''){
						if(params.topCloseState != false){
							header += '<button class="ly_close_box"><img class="f_cs_img" src="../img/close_btn.png" alt="닫기버튼"></button>';
						}
					} else {
						header += '<div class="ly_header">';
						if(params.topHeaderState == true) header += '<h1>'+params.contTitle+'</h1>';
						if(params.topCloseState == true) header += '<button class="close_btn"><img class="f_cs_img" src="../img/close_btn.png" alt="닫기버튼"></button>';
						header += '</div>';
					}
				}
			}

			if(params.contTextType == 1){
				if(params.contTextType == 1 && params.text == '') console.log(name +'의 contTextType값이 1이며 '+name+'의 text값이 없습니다.');
				content += '<div class="ly_content alertType">'+params.text+'<div id="lyCloseType"></div></div>';
			} else {
				content += '<div class="ly_content">'+params.contHtml+'<div id="lyCloseType"></div></div>';
				if(params.contTextType == 2 && params.contHtml == '') console.log(name +'의 contTextType값이 2이며 '+name+'의 contHtml값이 없습니다.');
			}

			btnArea = '<div class="alert_btn"></div>';
			container = '<div class="ly_container">'+header+content+btnArea+'</div>';

			if(params.backgroundState != true){
				lyBody = '<div id='+name+' class="'+params.targetContents+' border_line" uitype='+params.uiType+' style="visibility:hidden;">'+container+'</div>';
			} else {
				lyBody = '<div id='+name+' class='+params.targetContents+' uitype='+params.uiType+' style="visibility:hidden;">'+container+'<div class="ly_bg"></div></div>';
			}

			$('body').append(lyBody);

			if(params.topHeaderState == false && params.topCloseState == true || params.contTitle == '') $('#'+name).children('.ly_container').addClass('not_header');
			if(params.textArea != 'center') $('#'+name).children('.ly_container').children('.ly_content').addClass('text_'+params.textArea);
			
			//targetActionType일경우 최우선이 됨
			if(params.targetActionType != 'layer' || params.btn.length == 0){
				if(params.targetActionType != 'layer') $('#'+name).addClass('firstObj');
				$('#'+name).children('.ly_container').addClass('not_btn');
			}

			if(params.contTextType == 2){
				if(params.uiType == 'center'){
					$('#'+name).find('.ly_close_box').addClass('white').children('.f_cs_img').attr('src', '../img/close_btn_w.png');
				} else {
					$('#'+name).addClass('html_type');
				}
			}

			if(params.btn.length > 0 ){
				if(params.targetActionType != 'toastmessage'){
					var nameBtnArea = $('#'+name).children('.ly_container').children('.alert_btn');
					nameBtnArea.addClass('btn_length'+params.btn.length);//현재 버튼 최고갯수는 3개 갯수 추가에 따른 ui 추가 업데아트 예정 

					for(var i=0;params.btn.length>i;i++){
						if(params.btn.length == 2){
							if(i==0){
								nameBtnArea.append('<li class="funy_left">'+params.btn[i]+'</li>');
							} else {
								nameBtnArea.append('<li class="funy_right">'+params.btn[i]+'</li>');
							}
						} else if(params.btn.length == 3){
							if(i==0){
								nameBtnArea.append('<li class="funy_left">'+params.btn[i]+'</li>');
							} else if(i==1){
								nameBtnArea.append('<li class="funy_center">'+params.btn[i]+'</li>');
							} else {
								nameBtnArea.append('<li class="funy_right">'+params.btn[i]+'</li>');
							}
						} else {
							nameBtnArea.append('<li>'+params.btn[i]+'</li>');
							if(params.btn.length > 3) console.log(name +'의 입력된 버튼의 갯수는 '+params.btn.length+'입니다. 버튼의 최대 갯수는 3개 입니다.');
						}
					}
					if(params.negativeDirection != 'left') nameBtnArea.addClass('closeRight');
				}
			}

			var winBrowserWidth = window.innerWidth;//브라우져의 전체 넓이.
			var winBrowserHeight = window.innerHeight;//브라우져의 전체 넓이.
			if( winBrowserWidth > 640 ) winBrowserWidth = 640; //브라우져가 640px 이상일 경우 강제 지정.
			var winFullWidth = (winBrowserWidth/10);//브라우져의 전체 넓이의 1/10값을 구한다.
			var contBoxWidth = winFullWidth*params.alertBoxWidth;//컨텐츠의 넓이 값.
			var contBoxCenterVal = contBoxWidth/2;//컨텐츠를 중앙 정렬하기 위한 값.
			//기본적으로 absolute를 주고 left 50%한후 컨텐츠넓이의 절반을 주면 중앙정렬이 됨.
			if( winBrowserWidth < 340 ){//브라우져의 넓이가 320px 이하일 경우 컨텐츠의 넓이를 90%까지 넓힌다.
				var contBoxWidth = winFullWidth*9;
				var contBoxCenterVal = contBoxWidth/2;
				$('#'+name).children('.ly_container').css({"width":contBoxWidth, "margin-left":contBoxCenterVal - contBoxWidth});
			};

			if(winBrowserHeight < $('#'+name).children('.ly_container').height()+200){
				$('#'+name).children('.ly_container').children('.ly_content').css({'height': winBrowserHeight-300, 'overflow-y': 'auto'});
			}

			$('#'+name).children('.ly_container').css({"width":contBoxWidth,"margin-left":contBoxCenterVal - contBoxWidth});
			var contBoxHeight = $('#'+name).children('.ly_container').height();//중앙정렬을 위한 값 컨텐츠의 높이값을 구한다
			var contBoxCenterVal = contBoxHeight/2;//구한 높이값을 2로 나눠 값을 설정한다.

			if( $('#'+name).attr('uitype') == 'center'){
				$('#'+name).children('.ly_container').css({"top":"50%","margin-top":contBoxCenterVal - contBoxHeight});
				$('#'+name).attr('style', function(index, value){
					return "opacity:0;" + value;
				});
				initialValue = $('#'+name).attr('style');
			} else if($('#'+name).attr('uitype') == 'top') {
				$('#'+name).children('.ly_container').css("top","0");
				if(params.animationUi != false) $('#'+name).children('.ly_container').css({"margin-top":- $('#'+name).children('.ly_container').height(),"transition":".7s"});
				otherValue = $('#'+name).children('.ly_container').height();
				initialValue = $('#'+name).children('.ly_container').attr('style');
			} else if($('#'+name).attr('uitype') == 'bottom') {
				$('#'+name).children('.ly_container').css("bottom","0");
				if(params.animationUi != false) $('#'+name).children('.ly_container').css({"margin-bottom":- $('#'+name).children('.ly_container').height(),"transition":".7s"});
				otherValue = $('#'+name).children('.ly_container').height();
				initialValue = $('#'+name).children('.ly_container').attr('style');
			};
			
			funy_layerpopup.actionUI(initialValue);
		},

		actionUI: function(initialValue){//action 담당자
			$('#'+name).attr('openVal', false);
			okKeyData = funOkBtn([name, initialValue]);

			if( params.targetBtn == '' || params.targetBtn == undefined || params.targetBtn == null){//targetBtn의 값이 없을경우 함수호출하는 순간 액션
				setTimeout(function(){ 
					$('#'+name).attr('openVal', true);
					$('#'+name).attr('style','visibility:visible');
					funy_layerpopup.openActionEvent();
				}, 200);
			} else {
				$('.'+params.targetBtn+'').unbind('click').bind('click', function(e){
					$('#'+name).attr('openVal', true);
					$('#'+name).children('.ly_container').children('.funy_title').html(eval(params.contenttext));
					$('.'+params.targetBtn+'').attr('boxtype',name);
					$('#'+name).attr('style','visibility:visible');
					funy_layerpopup.openActionEvent();
					e.target.blur();
				});
			}

			$('#'+name).children('.ly_container').children('.alert_btn').children('li').unbind("click").bind("click", function(){
				if(params.btnNotClose != true) $('#'+name).attr('openVal', false);

				if( $(this).attr('class') == 'funy_right'){
					if(params.negativeDirection != 'left'){
						callBackFunc.cancel();
					} else {
						callBackFunc.ok();
					}
				} else if( $(this).attr('class') == 'funy_left'){
					if(params.negativeDirection != 'left'){
						callBackFunc.ok();
					} else {
						callBackFunc.cancel();
					}
				} else if( $(this).attr('class') == 'funy_center'){
					if(params.centerCallName != 'center'){
						callBackFunc[params.centerCallName]();
					} else {
						callBackFunc.center();
					}
				} else {
					if(params.centerCallName != 'center'){
						callBackFunc[params.centerCallName]();
					} else {
						callBackFunc.cancel();
					}
				};

				if(params.btnNotClose != true) funy_layerpopup.closeActionEvent();
			});

			if(params.backgroundClickClose == true || params.topCloseState == false && params.topHeaderState == false){
				$('#'+name).children('.ly_bg').unbind("click").bind("click", function(){
					if(params.btnNotClose != true) $('#'+name).attr('openVal', false);
					if(params.btnNotClose != true) funy_layerpopup.closeActionEvent();
					callBackFunc.cancel();
				});
			}

			//if(params.topHeaderState == true && params.btn == 0) params.topHeaderState = false;
			if(params.topHeaderState == true && params.contTitle == '') params.topHeaderState = false;

			if(params.topHeaderState != false){
				$('#'+name).children('.ly_container').children('.ly_header').children('.close_btn').unbind("click").bind("click", function(){
					if(params.btnNotClose != true) $('#'+name).attr('openVal', false);
					if(params.btnNotClose != true) funy_layerpopup.closeActionEvent();
					callBackFunc.cancel();
				});
			} else {
				$('#'+name).children('.ly_container').children('.ly_close_box').unbind("click").bind("click", function(){
					if(params.btnNotClose != true) $('#'+name).attr('openVal', false);
					if(params.btnNotClose != true) funy_layerpopup.closeActionEvent();
					callBackFunc.cancel();
				});
			}
			
			if(params.setTimeOut > 0){
				setTimeout(function(){
					$('#'+name+'').attr('style', 'opacity:0;visibility:hidden');
					if(params.animationUi != false) $('#'+name+'').css({"transition":".7s"});
				}, params.setTimeoutVal);
			}
		},

		openActionEvent: function(){//레이어팝업 오픈 이벤트
			var toastTime = params.setTimeoutVal;
			funy_layerpopup.overlapEvent();

			if(params.uiType != 'center' && params.targetActionType == 'toastmessage') toastTime = toastTime + 500;
			if( params.uiType == 'center'){
				$('#'+name).attr('style', function(index, value){
					return "opacity:1;" + value;
				}); 
			} else if(params.uiType == 'top') {
				$('#'+name).children('.ly_container').css("margin-top","10px");
			} else if(params.uiType == 'bottom') {
				$('#'+name).children('.ly_container').css("margin-bottom","10px");
			};

			if(params.targetActionType == 'toastmessage'){
				setTimeout(function(){
					$('#'+name).attr('openVal', false);
					funy_layerpopup.closeActionEvent();
				}, toastTime);
			} else {
				if($('.firstObj').length == 0){
					funy_layerpopup.keypressEvent();
				} else {
					setTimeout(function(){
						funy_layerpopup.keypressEvent();
					}, params.setTimeoutVal);
				}
			}
		},

		closeActionEvent: function(){//레이어팝업 클로즈 이벤트
			if( params.uiType == 'center'){
				$('#'+name).css('opacity', 0);
				if(params.animationUi != true){
					$('#'+name).attr('style', initialValue);
				} else {
					setTimeout(function(){
						$('#'+name).attr('style', initialValue);
					}, params.setTimeoutVal);
				}
			} else {
				var marginSta = '';
				if(params.uiType == 'top') marginSta ='margin-top'; else if(params.uiType == 'bottom') marginSta ='margin-bottom';

				$('#'+name).children('.ly_container').css(marginSta, -otherValue);

				if(params.animationUi != true){
					$('#'+name).attr('style','visibility:hidden');
				} else {
					setTimeout(function(){
						$('#'+name).attr('style','visibility:hidden');
					}, params.setTimeoutVal);
				}
			}

			if($('[openval=true]').length > 1){
				if(params.btnNotClose != true) $('#'+name).attr('openVal', false);
				funy_layerpopup.overlapEvent();
			} else {
				$('.funy_layerpopup').children('.ly_bg').show();
			}
		},

		overlapEvent: function(){//백그라운드 중복 방지 이벤트
			var openTrueVal =0;
			if($('.funy_layerpopup').length>1){//funy_layerpopup 의 갯수가 1개 이상이며
				if($('[openval=true]').length != 1){//openval=true가 1개 이상일때
					$('.funy_layerpopup').children('.ly_bg').hide();
					if($('.firstObj').attr('openval') == 'true'){
						var str = $('#'+name).attr('openval');
						var mybool = JSON.parse(str);
						if($('.funy_layerpopup').hasClass('firstObj') && mybool) $('.firstObj').children('.ly_bg').show();
					}
					if($('.firstObj').attr('openval') != 'true') $('[openval=true]').last().children('.ly_bg').show();
				} else {
					$('[openval=true]').last().children('.ly_bg').show();
				}
			}
		},

		//현재버전에서는 keypress시 엔터키와 스페이스 키만 인지하며 둘다 콜백으로 ok를 보냄
		keypressEvent: function(){
			$(document).keypress(function(event) {
				if (event.keyCode == '13' || event.keyCode == '32'){
					if($('[openval=true]').last().attr('id') == name){
						if(params.btn == 0){
							callBackFunc.cancel();
						} else {
							callBackFunc.ok();
						}
						funy_layerpopup.closeActionEvent();
					}
					if(params.btnNotClose != true) $('#'+name).attr('openVal', false);
				}
			});
		}
	}

	funy_layerpopup.dynamicUI();
}

function funOkBtn(val){
	return {
		basicData: function(){return val;},
		shangeData: function(_val){val = _val;}
	}
}

function funCancelBtn(id){
	$('#'+id).attr('openVal', false);
	$('#'+id+'').attr('style','visibility:hidden');
}