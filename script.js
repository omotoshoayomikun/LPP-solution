const bar = document.getElementById('bar');
const sm_screen = document.getElementById('sm_screen');

let show = false;

bar.addEventListener('click', () => {
    show = !show
    if (show) {
        bar.classList.add('open')
        sm_screen.classList.remove('d_n')
    } else {
        bar.classList.remove('open')
        sm_screen.classList.add('d_n')

    }
})