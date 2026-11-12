(function(){
  var rok=document.getElementById('rok'); if(rok) rok.textContent=new Date().getFullYear();

  // menu mobilne
  var burger=document.getElementById('burger'), menu=document.getElementById('menu');
  function zamknij(){menu.classList.remove('otw');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');}
  burger.addEventListener('click',function(){
    var otw=menu.classList.toggle('otw');
    burger.setAttribute('aria-expanded',otw?'true':'false');
    burger.setAttribute('aria-label',otw?'Zamknij menu':'Otwórz menu');
  });
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',zamknij);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij();});

  // aktywna pozycja menu
  var linki=[].slice.call(menu.querySelectorAll('a'));
  var sekcje=linki.map(function(a){return document.querySelector(a.getAttribute('href'));});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(wpisy){
      wpisy.forEach(function(w){
        if(w.isIntersecting){
          var i=sekcje.indexOf(w.target);
          linki.forEach(function(l,j){l.classList.toggle('akt',j===i);});
        }
      });
    },{rootMargin:'-45% 0px -50% 0px'});
    sekcje.forEach(function(s){if(s)io.observe(s);});

    // dolny pasek po przewinieciu za przycisk z pierwszego ekranu
    var mob=document.getElementById('mob'), cta=document.getElementById('hero-cta');
    new IntersectionObserver(function(w){
      var r=w[0].boundingClientRect;
      mob.classList.toggle('widac',!w[0].isIntersecting && r.top<0);
    }).observe(cta);
  }

  // galerie: palec, mysz, strzalki, klawiatura
  document.querySelectorAll('[data-galeria]').forEach(function(g){
    var tor=g.querySelector('.gal-tor'), n=tor.children.length, licz=g.querySelector('.gal-licz');
    function idx(){return Math.round(tor.scrollLeft/tor.clientWidth);}
    function idz(i){i=Math.max(0,Math.min(n-1,i));tor.scrollTo({left:i*tor.clientWidth,behavior:'smooth'});}
    tor.addEventListener('scroll',function(){licz.textContent=(idx()+1)+' / '+n;},{passive:true});
    g.querySelector('.gal-prev').addEventListener('click',function(){idz(idx()-1);});
    g.querySelector('.gal-next').addEventListener('click',function(){idz(idx()+1);});
    tor.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'){e.preventDefault();idz(idx()+1);}
      if(e.key==='ArrowLeft'){e.preventDefault();idz(idx()-1);}
    });
    var start=null,sl=0,ruch=false;
    tor.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse')return;
      start=e.clientX;sl=tor.scrollLeft;ruch=false;tor.classList.add('ciag');tor.setPointerCapture(e.pointerId);
    });
    tor.addEventListener('pointermove',function(e){
      if(start===null)return;
      var dx=e.clientX-start; if(Math.abs(dx)>4)ruch=true;
      tor.scrollLeft=sl-dx;
    });
    function koniec(e){
      if(start===null)return;
      var dx=e.clientX-start; start=null;tor.classList.remove('ciag');
      var i=Math.round(sl/tor.clientWidth);
      if(dx<-50)i++; else if(dx>50)i--;
      idz(i);
    }
    tor.addEventListener('pointerup',koniec);
    tor.addEventListener('pointercancel',koniec);
    tor.addEventListener('click',function(e){if(ruch){e.preventDefault();e.stopPropagation();ruch=false;}},true);
  });

  // formularz pokazowy
  var form=document.getElementById('form');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var info=document.getElementById('form-info'); info.hidden=false;
    info.scrollIntoView({behavior:'smooth',block:'nearest'});
  });
})();
