const cards = document.getElementsByClassName('card')
        
        for ( let i = 0; i < cards.length; i++) {

            if (selectedTheme) {
                cards[i].classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
            }

            themeButton.addEventListener('click', () => {
                cards[i].classList.toggle(darkTheme)
            })
        }