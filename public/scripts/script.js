function moveRight() {
    var slide = document.getElementById('slide1');
    slide.style.marginLeft = '-50%'
}

function moveLeft() {
    var slide = document.getElementById('slide1');
    slide.style.marginLeft = '0';
}

var option1 = document.getElementById('user');
var option2 = document.getElementById('bell');
var option3 = document.getElementById('envelope');

console.log(option1, option2, option3);

option1.addEventListener('change', function () {
    if (this.checked) {
        option2.checked = false;
        option3.checked = false;
    }
});

option2.addEventListener('change', function () {
    if (this.checked) {
        option1.checked = false;
        option3.checked = false;
    }
});

option3.addEventListener('change', function () {
    console.log(this);
    if (this.checked) {
        option1.checked = false;
        option2.checked = false;
    }
});

