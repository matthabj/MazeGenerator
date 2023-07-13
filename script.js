var mazeObj = document.getElementById("maze");
var grid = [];

var width = 80;
var height = 40;

const newGrid = () =>{
	grid = [];
	mazeObj.style.gridTemplateColumns = `repeat(${width},1fr)`
	
	for(let x = 0; x<width; x++){
		var row = [];
		for(let y = 0; y<height; y++){
			const tile = document.createElement("div");
			
			tile.style.backgroundColor = "#121212";
			tile.style.border = "1px solid #aaa";
			mazeObj.appendChild(tile);
			
			const t = {
				posX:x,
				posY:y,
				up:false,
				down:false,
				left:false,
				right:false,
				parrent:null
			}
			row.push(t);
		}
		grid.push(row);
	}
}
const getTile = (x,y) =>{
	if(x<0||y<0){return null;}
	if(x>=width||y>=height){return null;}
	return grid[x][y];
}
const getTileObject = (x,y) =>{
	if(x<0||y<0){return null;}
	return document.querySelectorAll(`#maze :nth-child(${(x+y*width)+1})`);
}
const updateTile = (tile) =>{
	var tileobj = getTileObject(tile.posX,tile.posY)[0];
	if(tileobj == null){return};
	
	tileobj.style.borderTop = (tile.up)?"none":"1px solid #aaa";
	tileobj.style.borderLeft = (tile.left)?"none":"1px solid #aaa";
	tileobj.style.borderBottom = (tile.down)?"none":"1px solid #aaa";
	tileobj.style.borderRight = (tile.right)?"none":"1px solid #aaa";
}
const getCloseTiles = (tile, blocked=false) =>{
	var n = [];
	var frontier;
	if(tile == null){return n};
	if(!blocked || tile.right)
	{
		frontier = getTile(tile.posX+1,tile.posY);
		if(frontier != null){n.push(frontier);}
	}
	if(!blocked || tile.left)
	{
		frontier = getTile(tile.posX-1,tile.posY);
		if(frontier != null){n.push(frontier);}
	}
	if(!blocked || tile.down)
	{
		frontier = getTile(tile.posX,tile.posY+1);
		if(frontier != null){n.push(frontier);}
	}
	if(!blocked || tile.up)
	{
		frontier = getTile(tile.posX,tile.posY-1);
		if(frontier != null){n.push(frontier);}
	}
	return n;
}
const primMaze = () =>{
	
	var v = [];
	var n = [];
	v.push(getTile(0,0))
	
	
	var start = v[0];
	n = getCloseTiles(start);
	while(n.length>0)
	{
		var nextTile = n[Math.floor(Math.random()*n.length)];
		var neighbors = getCloseTiles(nextTile).filter(tile => v.includes(tile));
		
		var start = neighbors[Math.floor(Math.random()*neighbors.length)];
		
		var move = {
			x: nextTile.posX - start.posX,
			y: nextTile.posY - start.posY
		}
		if(move.x== 1){start.right = true; nextTile.left = true;}
		if(move.x==-1){start.left = true; nextTile.right = true;}
		if(move.y== 1){start.down = true; nextTile.up = true;}
		if(move.y==-1){start.up = true; nextTile.down = true;}
		
		v.push(nextTile);
		var index = n.indexOf(nextTile);
		if (index !== -1) {
			n.splice(index, 1);
		}
		
		n = n.concat(getCloseTiles(nextTile).filter(tile => !(v.includes(tile)||n.includes(tile))));
		
		updateTile(start);
		updateTile(nextTile);
	}
}
const dCost = (tile, other) =>{
	let distX = tile.posX - other.posX;
	let distY = tile.posY - other.posY;
	
	let d = Math.sqrt(distX * distX + distY * distY);
	
	return d;
}
const fCost = (tile,start,end) =>{
	let g = dCost(tile,start);
	let h = dCost(tile,end);
		
	return g + h;
}
const Apath = (start,end) =>{
	var open = [start];
	var closed = [];
	
	for(let i = 0; i<20; i++)
	{
		let minFCost = Math.min(open.map(tile => fCost(tile,start,end)));
		
		current = open[0];
		open.forEach(tile =>{
			if(fCost(tile,start,end) == minFCost){current = tile;}
		});
		var index = open.indexOf(current);
		if (index !== -1) {
			open.splice(index, 1);
		}
		closed.push(current);
		console.log(current);
		if(current == end){return;}
		
		var neighbors = getCloseTiles(current,true);
		neighbors.forEach(n =>{
			if(closed.includes(n)){return;}
			
			if(dCost(current,end)<dCost(n,end) || !open.includes(n))
			{
				n.parrent = current;
				getTileObject(current.posX,current.posY)[0].style.backgroundColor = "#00ff00";
				if(!open.includes(n)){open.push(n);}
			}
		})
	}
	let pathTile = end;
	// closed.forEach(tile =>{
		// getTileObject(tile.posX,tile.posY)[0].style.backgroundColor = "#ff0000";
	// })
	console.log(closed.map(t => t.parent));
}
newGrid();

primMaze();
// Apath(getTile(0,0),getTile(3,3));