// 1、点击开始--》grass和score block；
// 2、左击：是雷，出现雷图，over block；不是雷，数字为周围8格的雷数，0：扩散直到不为0的数字
// 3、右击标记：出现红旗图，无标记--》标记；已经标记--》取消标记；标记正确--》score-1；
// 4、100格，随机10格为雷
// 5、10个雷都正确，success图出现，点到雷，over图出现；
// 6、close--》grass none，数据初始化；

var oStartBtn = document.getElementsByClassName('startBtn')[0],
	oGrass = document.getElementsByClassName('grass')[0],
	oScoreBox = document.getElementsByClassName('scoreBox')[0],
	oScore = document.getElementsByClassName('score')[0],
	oAlertBox = document.getElementsByClassName('alertBox')[0],
	oClose = document.getElementsByClassName('close')[0],
	mineNum,
	mineOver = 10,
	score = 10,
	mineMap = [],
	startGameBool = true;


bindEvent();

function init(){
	mineNum = 10;
	mineOver = 10;
	//生成10*10雷盘
	for(var i = 0; i < 10; i ++){
		for(var j = 0; j < 10; j ++){
			var con = document.createElement('div');
			con.classList.add('block');
			con.setAttribute('id',i + '-' + j);
			oGrass.appendChild(con);
			mineMap.push({mine:0});
		}
	}
	var oBlock = document.getElementsByClassName('block');
	while(mineNum){
		var mineIndex = Math.floor(Math.random() * 100);
		if(mineMap[mineIndex].mine === 0){
			mineMap[mineIndex].mine = 1;
			oBlock[mineIndex].classList.add('isLei');
			mineNum --;
		}
	}
	oScore.innerHTML = mineOver;
}

function leftClick(dom){
	var oIsLei = document.getElementsByClassName('isLei');
	if(dom && dom.classList.contains('isLei')){
		for(var i = 0; i < oIsLei.length; i ++){
			oIsLei[i].classList.add('show');
		}
		setTimeout(function(){
			oAlertBox.style.display = 'block';
			oAlertBox.classList.add('over');
		},800);
	}else{
		var n = 0;
		var posArr = dom && dom.getAttribute('id').split('-');
		var posX = posArr && +posArr[0];
		var posY = posArr && +posArr[1];
		console.log(posX,posY)
		dom && dom.classList.add('num');
		for(var i = posX - 1; i <= posX + 1; i ++){
			for(var j = posY - 1; j <= posY + 1; j ++){
				var aroundBox = document.getElementById(i + '-' + j);
				if(aroundBox && aroundBox.classList.contains('isLei')){
					n ++;
				}
			}
		}
		dom.innerHTML = n;
		if(n == 0){
			for(var i = posX - 1; i <= posX + 1; i ++){
				for(var j = posY - 1; j <= posY + 1; j ++){
					var nearBox = document.getElementById(i + '-' + j);
					if(nearBox && nearBox.length != 0){
						if(!nearBox.classList.contains('checked')){
							nearBox.classList.add('checked');
							leftClick(nearBox);
						}
					}
				}
			}
		}
	}
}

function rightClick(dom){
	if(dom.classList.contains('num')){
		return;
	}
	dom.classList.toggle('flag');
	if(dom.classList.contains('isLei') && dom.classList.contains('flag')){
		mineOver --;
	}
	if(dom.classList.contains('isLei') && !dom.classList.contains('flag')){
		mineOver ++;
	}
	oScore.innerHTML = mineOver;
	if(mineOver == 0){
		oAlertBox.classList.remove('over');
		oAlertBox.classList.add('success');
		oAlertBox.style.display = 'block';
	}
	
}

function bindEvent(){
	oStartBtn.onclick = function(){
		if(startGameBool){
			oGrass.style.display = 'block';
			oScoreBox.style.display = 'block';
			init();
			startGameBool = false;
		}
	}
	oGrass.oncontextmenu = function(){
		return false;
	}
	oAlertBox.oncontextmenu = function(){
		return false;
	}
	oGrass.onmousedown = function(e){
		var event = e.target;
		if(e.which == 1){
			leftClick(event);
		}else if(e.which == 3){
			rightClick(event);
		}
	}
	oClose.onclick = function(){
		oAlertBox.style.display = 'none';
		oGrass.style.display = 'none';
		oScoreBox.style.display = 'none';
		score = 10;
		oGrass.innerHTML = '';
		startGameBool = true;
	}
}



