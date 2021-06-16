function create_map(w,h){
    let map = [];
    for (let y = 0;y != h;y++){
        let a = [];
        for (let x = 0;x != w;x++){
            a.push({
                left    : true,
                bottom  : true,
                visited : false,
                y       : y,
                x       : x,
                distans : 0,
            });
        }
        map.push(a);
    }
    return  map;
}

function randint(min, max) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

function finish(){
    let start = map[0][0];

    for (let x = 0; x != w-2;x++){
        if(map[0][x].distans > start.distans) {start = map[0][x]}
        if(map[h-2][x].distans > start.distans) {start = map[0][x]}
    }

    for (let y = 0; y != h-2;y++){
        if(map[y][0].distans > start.distans) {start = map[y][0]}
        if(map[y][w-2].distans > start.distans) {start = map[y][w-2]}
    }

    if(start.x == 0) map[start.y][start.x].left = false;
    else if (start.y == 0) map[start.y][start.x].bottom = false;
    else if (start.x == w-2) map[start.y][start.x+1].left = false;
    else if (start.y == h-2) map[start.y+1][start.x].left = false;
}

var w = 100;
var h = 100;

var map = create_map(h,w);
create_lab();
finish();
draw_map();

function remwall(a,b) {
    if(a.x == b.x) {
        if(a.y > b.y) map[b.y][b.x].bottom = false;
        else map[a.y][a.x].bottom = false;
    } else {
        if (a.x > b.x) map[a.y][a.x].left = false;
        else map[b.y][b.x].left = false;
    }
}

function create_lab() {
    let current = map[0][0];
    current.visited = true;
    current.distans = 0;
    let stask = [];
    do {
        let neigb = [];

        let x = current.x;
        let y = current.y;

        if(x > 0 && !map[y][x-1].visited) {neigb.push(map[y][x-1]);}
        if(y > 1 && !map[y-1][x].visited) {neigb.push(map[y-1][x]);}
        if(x < w-2 && !map[y][x+1].visited) {neigb.push(map[y][x+1]);}
        if(y < h-2 && !map[y+1][x].visited) {neigb.push(map[y+1][x]);}

        if(neigb.length > 0) {
            let chosen = neigb[randint(0,neigb.length-1)];
            remwall(current, chosen);
            chosen.visited = true;
            stask.push(current);
            chosen.distans = stask.length;
            current = chosen;
        } else {
            current = stask.pop();
        }

    } while (stask.length > 0)
    return map;
}


function draw_map(){
    for (let x = 0; x != w;x++){
        map[0][x].left = false;
        map[h-1][x].left = false;
        map[h-1][x].bottom = false;
    }

    for (let y = 0 ; y != h;y++){
        map[y][w-1].bottom = false;
    }

    let object = document.getElementById("block");
    object.innerHTML = "";

    for(let y = 0; y != h;y++){
        let tr = document.createElement('tr');
        for(let x = 0; x != w; x++){
            let td = document.createElement("td");            
            if(map[y][x].left == true) td.style.borderLeft = "1px solid black";

            if(map[y][x].bottom == true) td.style.borderBottom = "1px solid black";

            tr.appendChild(td);
        }
        object.appendChild(tr);
    }
}
