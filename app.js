var canvas;
var ctx;

var LARGURA_TOTAL = 1200;
var ALTURA_TOTAL  = 900;

var boundX = 0; //Variaveis flag pra auxiliar no efeito de arrastar Blocos de parede na Malha
var boundY = 0; //Variaveis flag pra auxiliar no efeito de arrastar Blocos de parede na Malha

var dragok = false;

var blocoL = 20; //Largura dos Blocos
var blocoA = 20; //Altura dos Blocos

var blocoLinhaCount  = 25; //Limite para a malha de Blocos
var blocoColunaCount = 52; //Limite para a malha de Blocos

var blocos = [];

//Preencher blocos
for(var c = 0; c < blocoColunaCount;c++){
	blocos[c] = [];
	for(r = 0; r < blocoLinhaCount; r++){
		blocos[c][r] = {
			x: c * (blocoL + 3),
			y: r * (blocoA + 3),
			state: 'e' // Se esta vazio ou não
		};
	}
}

blocos[0][0].state = 'i'; //Bloco Incial
blocos[blocoColunaCount-1][blocoLinhaCount-1].state = 'f'; //Bloco final

//Construir BLoco
function buildSquare(x,y,w,h, state){
	//Cores
	if(state == 'i'){
		ctx.fillStyle = '#00FF00';
	}else if(state == 'f'){
		ctx.fillStyle = '#FF0000';
	}else if(state == 'p'){
		ctx.fillStyle = '#0000FF';
	}else if(state == 'e'){
		ctx.fillStyle = '#AAAAAA';
	}else if(state == 'x'){
		ctx.fillStyle = '#000000';
	}else{
		ctx.fillStyle = '#FEFF3F';
	}
	ctx.beginPath();
	ctx.rect(x,y,w,h);
	ctx.closePath();
	ctx.fill();
}

//Constroi malha
function pintar(){
	clear();
	for(var c = 0; c < blocoColunaCount; c++){
		for(var r = 0; r < blocoLinhaCount; r++){
			buildSquare(blocos[c][r].x, blocos[c][r].y, blocoL, blocoA, blocos[c][r].state);
		}
	}
}
function clear(){
	ctx.clearRect(0,0, LARGURA_TOTAL, ALTURA_TOTAL);
}
function run(){
	canvas = document.getElementById('painel');
	ctx    = canvas.getContext("2d");
	return setInterval(pintar, 10);
}
function painelDown(e){
	canvas.onmousemove = painelMove;
	var x = e.pageX - canvas.offsetLeft;//Limite do Canvas 
	var y = e.pageY - canvas.offsetTop; //Limite do Canvas

	for(var c = 0; c < blocoColunaCount; c++){
		for(var r = 0; r < blocoLinhaCount; r++){
			if(c*(blocoL+3) < x && x < c*(blocoL+3)+blocoL && r*(blocoA+3) < y && y < r*(blocoA+3)+blocoA){
				if(blocos[c][r].state == 'e' && (c != boundX || r != boundY)){
					blocos[c][r].state = 'p';
					boundX = c;
					boundY = r;
				}else if(blocos[c][r].state == 'p' && (c != boundX || r != boundY)){
					blocos[c][r].state = 'e';
					boundX = c;
					boundY = r;
				}
			}
		}
	}
}
function painelUp(e){
	canvas.onmousemove = null;
}
function painelMove(e){

	var x = e.pageX - canvas.offsetLeft;//Limite do Canvas 
	var y = e.pageY - canvas.offsetTop; //Limite do Canvas

	for(var c = 0; c < blocoColunaCount; c++){
		for(var r = 0; r < blocoLinhaCount; r++){
			if(c*(blocoL+3) < x && x < c*(blocoL+3)+blocoL && r*(blocoA+3) < y && y < r*(blocoA+3)+blocoA){
				if(blocos[c][r].state == 'e' && (c != boundX || r != boundY)){
					blocos[c][r].state = 'p';	
					boundX = c;
					boundY = r;
				}else if(blocos[c][r].state == 'p' && (c != boundX || r != boundY)){
					blocos[c][r].state = 'e';
					boundX = c;
					boundY = r;
				}
			}
		}
	}
}
function find(){
	//A mágica esta aqui
	var XFila = [0];
	var YFila = [0];

	var caminhoEncontrado = false;

	var xLoc;
	var yLoc;

	while(XFila.length > 0 && !caminhoEncontrado){
		ciclos++;
		xLoc = XFila.shift();
		yLoc = YFila.shift();

		if(xLoc > 0){
			if(blocos[xLoc-1][yLoc].state == 'f'){
				caminhoEncontrado = true;
			}
		}
		if(xLoc < blocoColunaCount - 1){
			if(blocos[xLoc+1][yLoc].state == 'f'){
				caminhoEncontrado = true;
			}
		}

		if(yLoc > 0){
			if(blocos[xLoc][yLoc-1].state == 'f'){
				caminhoEncontrado = true;
			}
		}
		if(yLoc < blocoLinhaCount - 1){
			if(blocos[xLoc][yLoc+1].state == 'f'){
				caminhoEncontrado = true;
			}
		}

		if(xLoc > 0){
			if(blocos[xLoc-1][yLoc].state == 'e'){
				XFila.push(xLoc-1);
				YFila.push(yLoc);
				blocos[xLoc-1][yLoc].state = blocos[xLoc][yLoc].state + 'l'; 
			}
		}
		if(xLoc < blocoColunaCount - 1){
			if(blocos[xLoc+1][yLoc].state == 'e'){
				XFila.push(xLoc+1);
				YFila.push(yLoc);
				blocos[xLoc+1][yLoc].state = blocos[xLoc][yLoc].state + 'r'; 
			}
		}

		if(yLoc > 0){
			if(blocos[xLoc][yLoc-1].state == 'e'){
				XFila.push(xLoc);
				YFila.push(yLoc-1);
				blocos[xLoc][yLoc-1].state = blocos[xLoc][yLoc].state + 'u'; 
			}
		}
		if(yLoc < blocoLinhaCount - 1){
			if(blocos[xLoc][yLoc+1].state == 'e'){
				XFila.push(xLoc);
				YFila.push(yLoc+1);
				blocos[xLoc][yLoc+1].state = blocos[xLoc][yLoc].state + 'd'; 
			}
		}
	}
	if(!caminhoEncontrado){
		alert('Não há como ser resolvido... Pelo menos não ainda.');
	}else{
		alert('Resolvido');

		var caminho = blocos[xLoc][yLoc].state;
		var caminhoLen = caminho.length;
		var currX = 0;
		var currY = 0;

		for (var i = 0 ; i < caminhoLen-1; i++) {
			if(caminho.charAt(i+1) == 'u'){
				currY--;
			}
			if(caminho.charAt(i+1) == 'd'){
				currY++;
			}
			if(caminho.charAt(i+1) == 'r'){
				currX++;
			}
			if(caminho.charAt(i+1) == 'l'){
				currX--;
			}
			blocos[currX][currY].state = 'x';
		}
	}

}

run();
canvas.onmousedown = painelDown;
canvas.onmouseup   = painelUp;