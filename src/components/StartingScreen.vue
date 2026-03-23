<template>
    <div id="loader" aria-hidden="true" class="my-auto">
        <div class="line line-1">
            <span id="line-first"><p id="counter">100</p>- 100</span><h1>Your</h1>
        </div>
        <div class="line"><h1 >Web Experience</h1></div>
        <div class="line"> <h1>is loading right <span>Now</span></h1></div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['finished'])

onMounted(() => {
  loadCounter()
})

function loadCounter() {
  let counter = document.querySelector("#counter");

  let count = 0;
  let t = setInterval(() => {
    if (count < 100) {
      counter.textContent = count++;
    } else {
      counter.textContent = "100";
      clearInterval(t);
    }
  }, 30);

    gsap.to("#loader", {
        yPercent: -100,
        duration: 0.9,
        delay: 4,
        ease: "power3.inOut",
        onComplete: () => emit('finished')
    });

  gsap.from("#line-first", {
    opacity: 0,
    duration: 0.5,
    // delay: 0.2,
    scrub: 3,
  });

  gsap.to("#loader h1", {
    top:0,
    duration: 0.8,
    // delay: 0.2,
    stagger: 0.2,
    scrub: 3,
  });
}
</script>

<style scoped>
    /* ----- LOADER ----- */
#loader{
    height: 100Vh;
    width: 100vw;
    background-color: #111111;
    padding: 6vw 6vw; 
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    opacity: 1;
    overflow: hidden;
}

#loader .line {
    height: -webkit-fit-content;
    height: -moz-fit-content;
    height: fit-content;
    overflow-y: hidden;
}

#loader .line h1{
    color: white;
    font-size: 7vw;
    line-height: 7vw;
    font-family: Plain;
    text-transform: uppercase;
    font-weight: 500;
    overflow-y: hidden;
    width: 100vw;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
            position: relative;
            top: 500px;
}

#loader div{
    width: 100%;
    height: -webkit-fit-content;
    height: -moz-fit-content;
    height: fit-content;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: start;
        -ms-flex-pack: start;
            justify-content: start;
    gap: 2vw;
}

#loader div span{
    width: 17vw;
    color: white;
    font-size: 3vw;
    font-family: "silk-serif";
    text-transform: uppercase;
    margin-top: -2.5vw;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
}

#loader div #line-first{
    width: 18vw;
    margin-left: 5vw;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: justify;
        -ms-flex-pack: justify;
            justify-content: space-between;
}

#loader div:nth-child(3) span{
    color: transparent;
    font-size: 7vw;
    text-transform: uppercase;
    margin: 0 2vw;
    font-weight: 200;
    -webkit-text-stroke: 1px white;
    /* animation: animation 1s linear 0.5 infinite forwards; */
    -webkit-animation-name: anime;
            animation-name: anime;
    -webkit-animation-duration: 1.5s;
            animation-duration: 1.5s;
    -webkit-animation-iteration-count: infinite;
            animation-iteration-count: infinite;
    -webkit-animation-delay: 1s;
            animation-delay: 1s;
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;

}

@-webkit-keyframes anime {
    0%{
        font-family: Plain;
        opacity: 0;
        color: white;
    }
    15%{
        font-family: Plain;
        opacity: 1;
        color: white;
    }
    45%{
        font-family: Plain;
        opacity: 1;
        color: white;
    }
    48%{
        font-family: Plain;
        opacity: 0;
        color: white;
    }
    55%{
        font-family: "silk-serif";
        opacity: 0;
        color: transparent;
    }
    58%{
        font-family: "silk-serif";
        opacity: 1;
        color: transparent;
    }
    85%{
        font-family: "silk-serif";
        opacity: 1;
        color: transparent;
    }
    95%{
        font-family: "silk-serif";
        opacity: 0;
        color: transparent;
    }
    100%{
        font-family: "silk-serif";
        opacity: 0;
        color: transparent;
    }
}

@keyframes anime {
    0%{
        font-family: Plain;
        opacity: 0;
        color: white;
    }
    15%{
        font-family: Plain;
        opacity: 1;
        color: white;
    }
    45%{
        font-family: Plain;
        opacity: 1;
        color: white;
    }
    48%{
        font-family: Plain;
        opacity: 0;
        color: white;
    }
    55%{
        font-family: "silk-serif";
        opacity: 0;
        color: transparent;
    }
    58%{
        font-family: "silk-serif";
        opacity: 1;
        color: transparent;
    }
    85%{
        font-family: "silk-serif";
        opacity: 1;
        color: transparent;
    }
    95%{
        font-family: "silk-serif";
        opacity: 0;
        color: transparent;
    }
    100%{
        font-family: "silk-serif";
        opacity: 0;
        color: transparent;
    }
}
</style>

 