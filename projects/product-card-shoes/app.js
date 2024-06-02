function clickbtn(){

  let button = document.querySelector('.btn');
  let radio1 = document.querySelector('#radio1');
  let radio2 = document.querySelector('#radio2');
  let radio3 = document.querySelector('#radio3');
  let radio4 = document.querySelector('#radio4');
  let image1 = document.querySelector('.green');
  let image2 = document.querySelector('.purple');
  let image3 = document.querySelector('.red');
  let image4 = document.querySelector('.pink');

  radio1.addEventListener('click', function() {
    image1.style.display = 'block';
    button.classList.add('btn-green');
    button.classList.remove('btn-purple');
    button.classList.remove('btn-red');
    button.classList.remove('btn-pink');

    image2.style.display = 'none';
    image3.style.display = 'none';
    image4.style.display = 'none';
  });

  radio2.addEventListener('click', function() {
    image2.style.display = 'block';
    button.classList.add('btn-purple');
    button.classList.remove('btn-green');
    button.classList.remove('btn-red');
    button.classList.remove('btn-pink');

    image1.style.display = 'none';
    image3.style.display = 'none';
    image4.style.display = 'none';
  });

  radio3.addEventListener('click', function() {
    image3.style.display = 'block';
    button.classList.add('btn-red');
    button.classList.remove('btn-green');
    button.classList.remove('btn-pink');
    button.classList.remove('btn-purple');

    image1.style.display = 'none';
    image2.style.display = 'none';
    image4.style.display = 'none';
  });

  radio4.addEventListener('click', function() {
    image4.style.display = 'block';
    button.classList.add('btn-pink');
    button.classList.remove('btn-red');
    button.classList.remove('btn-purple');
    button.classList.remove('btn-green');

    image1.style.display = 'none';
    image2.style.display = 'none';
    image3.style.display = 'none';
  });
}

clickbtn();