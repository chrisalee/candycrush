document.addEventListener("DOMContentLoaded", () => {  
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score')
    
    const width = 8 ;
    const squares = [];
    let score = 0;

    const candyColors = [
        'url(images/red-candy.png)',
        'url(images/blue-candy.png)',
        'url(images/green-candy.png)',
        'url(images/purple-candy.png)',
        'url(images/orange-candy.png)',
        'url(images/yellow-candy.png)'
    ];

    //creating the board
    function createBoard() {
        for (let i = 0; i < width*width; i++) {
            const square = document.createElement('div')
            square.setAttribute('draggable', true)  //allows each square div to be clicked and dragged
            square.setAttribute('id', i) //to give each square an id
            let randomColor = Math.floor(Math.random() * candyColors.length)
            square.style.backgroundImage = candyColors[randomColor]
            grid.appendChild(square)
            squares.push(square)
        }
    };
    createBoard();

    //drag the candies  ****************************************************************
    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    squares.forEach(square => square.addEventListener('dragstart', dragStart));
    squares.forEach(square => square.addEventListener('dragend', dragEnd));
    squares.forEach(square => square.addEventListener('dragover', dragOver));
    squares.forEach(square => square.addEventListener('dragenter', dragEnter));
    squares.forEach(square => square.addEventListener('dragleave', dragLeave));
    squares.forEach(square => square.addEventListener('drop', dragDrop));

    function dragStart() {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id)
        console.log(this.id, ' dragstart');
        console.log(colorBeingDragged);
    };

    function dragOver(e) {
        e.preventDefault()  //change this up later to add animations
        console.log(this.id, ' dragover');
    };

    function dragEnter(e) {
        e.preventDefault()
        console.log(this.id, ' dragenter');
    };

    function dragLeave(e) {
        e.preventDefault()
        console.log(this.id, ' dragleave');
    };

    function dragDrop() {
        // console.log(this.id, ' dragdrop');
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;

    };

    function dragEnd() {
        // console.log(this.id, ' dragend');
        //what is a valid move
        let validMoves = [
            squareIdBeingDragged -1,           //left
            squareIdBeingDragged - width,      //above
            squareIdBeingDragged + 1,          //right
            squareIdBeingDragged + width       //below
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        }
        else if (squareIdBeingReplaced && !validMove) {  //make sure nothing changes if trying to do a move 
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
        else {
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
        }
        //add some animation and some styling with this (maybe use css animate)
    };

    //drop candies, replacing the ones that have been cleared
    function moveCandyDown(){
        for (let i = 0; i < 55; i++) {
            if (squares[i + width].style.backgroundImage === '') {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = ''
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);
                if (isFirstRow && squares[i].style.backgroundImage === '') {
                    let randomColor = Math.floor(Math.random() * candyColors.length)
                    squares[i].style.backgroundImage = candyColors[randomColor]
                };
            };
        };
    };


    //   ************checking for matches**************************
    //check for row of three of same
    function checkRowForThree() {
        for (let i = 0; i < 61; i++) {  //no squares after 63, 
            let rowOfThree = [i, i+1, i+2];
            let choosenColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';
                        
            //not valid from one row to the next  --> square[7], cannot connect to square[8] (end of first row, start of second row)
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];  //can't start three in a row at these squares[i]
            if (notValid.includes(i)){
                continue;
            };

            if (rowOfThree.every(index => squares[index].style.backgroundImage === choosenColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                rowOfThree.forEach(index => {
                    squares[index].style.backgroundImage = ''
                });
            };
        };
    };

    //check for row of same four
    function checkRowForFour() {
        for (let i = 0; i < 60; i++) {
            let rowOfFour = [i, i+1, i+2, i+3];
            let choosenColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
            if (notValid.includes(i)){
                continue;
            };

            if (rowOfFour.every(index => squares[index].style.backgroundImage === choosenColor && !isBlank)) {
                score +=4;
                scoreDisplay.innerHTML = score;
                rowOfFour.forEach(index => {
                    squares[index].style.backgroundImage = ''
                })
            };
        };
    };

    //check for row of same five
    function checkRowForFive() {
        for (let i = 0; i < 59; i++) {
            let rowOfFive = [i, i+1, i+2, i+3, i+4];
            let choosenColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            const notValid = [4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38, 39, 44, 45, 46, 47, 52, 53, 54, 55];
            if (notValid.includes(i)){
                continue;
            };

            if (rowOfFive.every(index => squares[index].style.backgroundImage === choosenColor && !isBlank)) {
                score +=5;
                scoreDisplay.innerHTML = score;
                rowOfFive.forEach(index => {
                    squares[index].style.backgroundImage = ''
                });
            };
        };
    };

    //check for column of three same
    function checkColumnForThree() {
        for (let i = 0; i < 47; i++){
            let columnOfThree = [i, i+width, i+(width*2)];
            let choosenColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            if (columnOfThree.every(index => squares[index].style.backgroundImage === choosenColor && !isBlank)) {
                score +=3;
                scoreDisplay.innerHTML = score;
                columnOfThree.forEach(index => {
                    squares[index].style.backgroundImage = ''
                });
            };
        };
    };

    //check for column of four same
    function checkColumnForFour() {
        for (let i = 0; i < 47; i++) {
            let columnOfFour = [i, i+width, i+(width*2), i+(width*3)];
            let choosenColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            if (columnOfFour.every(index => squares[index].style.backgroundImage === choosenColor && !isBlank)) {
                score +=4;
                scoreDisplay.innerHTML = score;
                columnOfFour.forEach(index => {
                    squares[index].style.backgroundImage = ''
                });
            }
        };
    };

    // check for column of five same
    function checkColumnForFive() {
        for (let i = 0; i < 47; i++) {
            let columnOfFive = [i, i+width, i+(width*2), i+(width*3), i+(width*4)];
            let choosenColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            if (columnOfFive.every(index => squares[index].style.backgroundImage === choosenColor && !isBlank)) {
                score +=5;
                scoreDisplay.innerHTML = score;
                columnOfFive.forEach(index => {
                    squares[index].style.backgroundImage = ''
                });
            };
        };
    };

    checkRowForFive();
    checkColumnForFive();
    checkRowForFour();
    checkColumnForFour();
    checkRowForThree();
    checkColumnForThree();

    window.setInterval(function(){  //constantly refreshing every milisecond to see if three, four, five
        moveCandyDown();
        checkRowForFive();
        checkColumnForFive();
        checkRowForFour();
        checkColumnForFour();
        checkRowForThree();
        checkColumnForThree();
    }, 100);
    //   ************end checking for matches**************************


})

