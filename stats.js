const params = new URLSearchParams(window.location.search);
const target = params.get('name');

const data = sessionStorage.getItem('clubMembers');

if(data){
    const players = JSON.parse(data);

    const targetPlayer = players.find(p => p.name === target);

    if(targetPlayer){
        console.log("Player found!", targetPlayer);


        const storedClub = sessionStorage.getItem('clubName');
        const storedCrest = sessionStorage.getItem('clubCrestUrl');

        console.log(storedClub, storedCrest);
        const clubImage = document.getElementById('club-image');
        const currentClub = document.getElementById('club-name');
        clubImage.src=storedCrest;
        currentClub.textContent = storedClub;
        

        const playerTitle = document.querySelectorAll('.player-name');
        playerTitle.forEach(player => {
            player.textContent = targetPlayer.name;
        })

        const proName = targetPlayer.proName;
        document.getElementById('pro-name').textContent = proName;

        const height = targetPlayer.proHeight;
        document.getElementById('height').textContent = height;

        const favePosition = targetPlayer.favoritePosition;
        const formattedPosition = favePosition.charAt(0).toUpperCase() + favePosition.slice(1).toLowerCase();
        document.getElementById('position').textContent = formattedPosition;

        const rating = targetPlayer.ratingAve;
        document.getElementById('rating').textContent = rating;

        const goals = targetPlayer.goals;
        document.getElementById('goals').textContent = goals;

        const assists = targetPlayer.assists;
        document.getElementById('assists').textContent = assists;

        const passes = targetPlayer.passesMade;
        document.getElementById('passes').textContent = passes;

        const passRate = targetPlayer.passSuccessRate;
        document.getElementById('passRate').textContent = passRate;

        const tackles = targetPlayer.tacklesMade;
        document.getElementById('tackles').textContent = tackles;

        const tackleRate = targetPlayer.tackleSuccessRate;
        document.getElementById('tackleRate').textContent = tackleRate;

        const motm = targetPlayer.manOfTheMatch;
        document.getElementById('motm').textContent = motm;

    }
}