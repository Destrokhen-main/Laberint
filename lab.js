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
                player  : false,
                way     : false,
                finall  : false,
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

    start.finall = true;
}

var w = 20;
var h = 20;
var show_map = false;

var map = create_map(h,w);
map[0][0].player = true;

var current_player = map[0][0];

create_lab();
finish();
draw_map();


function check_wall(cx,cy,y,x){
    if (x == 1 && map[cy][cx+1].left == false)
        return true;
    else if (x == -1 && map[cy][cx].left == false)
        return true;
    else if (y == 1 && map[cy][cx].bottom == false)
        return true;
    else if (y == -1 && map[cy-1][cx].bottom == false)
        return true;
}

window.addEventListener('keydown', function(e){
    let cx = current_player.x;
    let cy = current_player.y;
    let x;
    let y;
    if(e.key == "w") {
        x = 0;
        y = -1;
    } else if (e.key == "a") {
        y = 0;
        x = -1;
    } else if (e.key == "d") {
        y = 0;
        x = 1;
    } else if (e.key == "s") {
        x = 0;
        y = 1;
    }

    if(x == 1 && cx+1 < w) {
        if(check_wall(cx,cy,y,x)) {
            map[cy][cx].player = false;
            map[cy][cx].way     = true;
            map[cy][cx+1].player = true;
            current_player = map[cy][cx+1];
        }
    } else if (x == -1 && cx-1 >= 0) {
        if(check_wall(cx,cy,y,x)) {
            map[cy][cx].player  = false
            map[cy][cx].way     = true;
            map[cy][cx-1].player = true;
            current_player = map[cy][cx-1];
        }
    } else if (y == 1 && cy+1 < h) {
        if(check_wall(cx,cy,y,x)) {
            map[cy][cx].player = false
            map[cy][cx].way     = true;
            map[cy+1][cx].player = true;
            current_player = map[cy+1][cx];
        }
    } else if (y == -1 && cy-1 < h) {
        if(check_wall(cx,cy,y,x)) {
            map[cy][cx].player = false;
            map[cy][cx].way     = true;
            map[cy-1][cx].player = true;
            current_player = map[cy-1][cx];
        }
    }

    if(current_player.finall == true) {
        alert('Отлично, ты прошёл');
        location.reload();
    }
    draw_map();
})


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

            if(map[y][x].player == true) {
                td.innerText = "@";
            } else {
                td.innerText = "@";
                td.style.color = "white";
            }

            if(map[y][x].way == true && map[y][x].player == false) {
                if(show_map) td.style.color = "green";
            }

            tr.appendChild(td);
        }
        object.appendChild(tr);
    }
}


document.getElementById('show').addEventListener('click',function(e){
    let element = document.getElementById('show');
    if(element.getAttribute('tg') == 0){
        element.setAttribute('tg','1');
        element.innerText = "Скрыть путь";
        show_map = true;
    } else {
        element.setAttribute('tg','0');
        element.innerText = "Показать путь";
        show_map = false;
    }

});

