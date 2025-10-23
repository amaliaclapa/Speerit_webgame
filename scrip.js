document.addEventListener('DOMContentLoaded', function() {
    var howToPlayLink = document.getElementById('howToPlay');
    
    var rulesBox = document.querySelector('.rulesBox');

    howToPlayLink.addEventListener('click', function() {
        rulesBox.style.transform = 'scale(1)';
    });

    document.querySelector('.icon-close').addEventListener('click', function() {
        rulesBox.style.transform = 'scale(0)';
    });

    document.querySelector('.playButton').addEventListener('click',function(){
        document.querySelector('.joinBox').style.transform='scale(1)';
        document.querySelector('.createGame').style.transform='scale(0)';
    })

    document.querySelector('.icon-close2').addEventListener('click',function(){
        document.querySelector('.joinBox').style.transform='scale(0)';
    })

    document.querySelector('#create').addEventListener('click',function(){
        document.querySelector('.createGame').style.transform='scale(1)';
        document.querySelector('.joinBox').style.transform='scale(0)';
        setTimeout(() => {
        window.location.href = 'app.html';
        }, 500);
    })

    document.querySelector('.icon-close3').addEventListener('click',function(){
        document.querySelector('.createGame').style.transform='scale(0)';
        document.querySelector('.joinBox').style.transform='scale(1)';
    })
    document.querySelector('.icon-close4').addEventListener('click',function(){
        document.querySelector('.joinGame').style.transform='scale(0)';
        document.querySelector('.joinBox').style.transform='scale(1)';
    })
    document.querySelector('#join').addEventListener('click',function(){
        document.querySelector('.joinGame').style.transform='scale(1)';
        document.querySelector('.joinBox').style.transform='scale(0)';
    })
});
document.addEventListener('DOMContentLoaded', () => {
    const gameCode = localStorage.getItem('gameCode');
    if (gameCode) {
        document.getElementById('gameCodeDisplay').innerText = `Game Code: ${gameCode}`;
    }
});



