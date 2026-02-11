document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const lottoNumbersEl = document.getElementById('lotto-numbers');

    generateBtn.addEventListener('click', () => {
        const groups = generateTwoGroups();
        lottoNumbersEl.innerHTML = '';
        groups.forEach((numbers, index) => {
            const group = document.createElement('div');
            group.classList.add('lotto-group');

            const label = document.createElement('div');
            label.classList.add('group-label');
            label.textContent = `Group ${index + 1}`;
            group.appendChild(label);

            const balls = document.createElement('div');
            balls.classList.add('group-balls');
            numbers.regular.forEach(number => {
                const ball = document.createElement('div');
                ball.classList.add('ball');
                ball.textContent = number;

                if (number <= 10) ball.classList.add('yellow');
                else if (number <= 20) ball.classList.add('blue');
                else if (number <= 30) ball.classList.add('red');
                else if (number <= 40) ball.classList.add('grey');
                else ball.classList.add('green');

                balls.appendChild(ball);
            });

            const separator = document.createElement('div');
            separator.classList.add('separator');
            separator.textContent = '+';
            balls.appendChild(separator);

            const megaBall = document.createElement('div');
            megaBall.classList.add('ball', 'mega');
            megaBall.textContent = numbers.mega;
            balls.appendChild(megaBall);

            group.appendChild(balls);
            lottoNumbersEl.appendChild(group);
        });
    });

    // Lunch Menu Recommendation
    const lunchBtn = document.getElementById('lunch-btn');
    const lunchResultEl = document.getElementById('lunch-result');

    const lunchMenus = [
        { name: 'Kimchi Jjigae', emoji: '🍲', desc: 'Spicy kimchi stew with pork and tofu' },
        { name: 'Bibimbap', emoji: '🍚', desc: 'Mixed rice with vegetables and gochujang' },
        { name: 'Tonkatsu', emoji: '🍱', desc: 'Crispy fried pork cutlet with cabbage' },
        { name: 'Jajangmyeon', emoji: '🍜', desc: 'Noodles in black bean sauce' },
        { name: 'Budae Jjigae', emoji: '🥘', desc: 'Army stew with ramen, sausage and spam' },
        { name: 'Chicken Teriyaki', emoji: '🍗', desc: 'Grilled chicken with sweet teriyaki glaze' },
        { name: 'Sushi Set', emoji: '🍣', desc: 'Assorted fresh sushi platter' },
        { name: 'Pasta Carbonara', emoji: '🍝', desc: 'Creamy pasta with bacon and parmesan' },
        { name: 'Beef Burger', emoji: '🍔', desc: 'Juicy beef patty with fresh toppings' },
        { name: 'Tteokbokki', emoji: '🌶️', desc: 'Spicy stir-fried rice cakes' },
        { name: 'Samgyeopsal', emoji: '🥓', desc: 'Grilled pork belly with lettuce wraps' },
        { name: 'Udon', emoji: '🍜', desc: 'Thick wheat noodles in savory broth' },
        { name: 'Fried Rice', emoji: '🍳', desc: 'Wok-fried rice with egg and vegetables' },
        { name: 'Gimbap', emoji: '🍙', desc: 'Korean seaweed rice rolls' },
        { name: 'Pizza', emoji: '🍕', desc: 'Classic cheese and pepperoni pizza' },
    ];

    lunchBtn.addEventListener('click', () => {
        const pick = lunchMenus[Math.floor(Math.random() * lunchMenus.length)];
        lunchResultEl.innerHTML = `
            <div class="lunch-card">
                <div class="lunch-emoji">${pick.emoji}</div>
                <div class="lunch-name">${pick.name}</div>
                <div class="lunch-desc">${pick.desc}</div>
            </div>
        `;
        lunchResultEl.querySelector('.lunch-card').classList.add('pop-in');
    });

    // Review Form
    const stars = document.querySelectorAll('#star-rating .star');
    const ratingInput = document.getElementById('review-rating-value');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.value);
            ratingInput.value = selectedRating;
            stars.forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.value) <= selectedRating);
            });
        });

        star.addEventListener('mouseenter', () => {
            const hoverVal = parseInt(star.dataset.value);
            stars.forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.value) <= hoverVal);
            });
        });
    });

    document.getElementById('star-rating').addEventListener('mouseleave', () => {
        stars.forEach(s => {
            s.classList.toggle('active', parseInt(s.dataset.value) <= selectedRating);
        });
    });

    const reviewForm = document.getElementById('review-form');
    const reviewStatus = document.getElementById('review-status');

    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('review-submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        reviewStatus.textContent = '';
        reviewStatus.className = '';

        try {
            const response = await fetch(reviewForm.action, {
                method: 'POST',
                body: new FormData(reviewForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                reviewStatus.textContent = 'Thank you for your review!';
                reviewStatus.className = 'success';
                reviewForm.reset();
                selectedRating = 0;
                stars.forEach(s => s.classList.remove('active'));
            } else {
                reviewStatus.textContent = 'Something went wrong. Please try again.';
                reviewStatus.className = 'error';
            }
        } catch {
            reviewStatus.textContent = 'Network error. Please try again.';
            reviewStatus.className = 'error';
        }

        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Review';
    });

    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 49) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function generateTwoGroups() {
        const allNumbers = new Set();
        const groups = [];

        while (groups.length < 2) {
            const group = new Set();
            while (group.size < 5) {
                const candidate = Math.floor(Math.random() * 49) + 1;
                if (!allNumbers.has(candidate)) {
                    group.add(candidate);
                    allNumbers.add(candidate);
                }
            }
            const mega = Math.floor(Math.random() * 25) + 1;
            groups.push({
                regular: Array.from(group).sort((a, b) => a - b),
                mega: mega
            });
        }

        return groups;
    }
});
