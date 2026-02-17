const searchBox = document.querySelector('.search input');
const searchButton = document.querySelector('.search button');
const clubNameDisplay = document.querySelector('.club-name h2');
const historyContainer = document.querySelector('.match-history-container');
    const memberList = document.querySelector('.member-stats-container');

searchButton.addEventListener('click', async () => {
    const clubName = searchBox.value;
    const clubId = await getClubId(clubName);
    console.log(`Club ID for ${clubName}: ${clubId}`);
});

function toggleDetails(button) {
    const card = button.closest(".history-card");
    card.classList.toggle('expanded');
} 

async function getClubId(clubName) {
    try {
        const response = await fetch(`https://fc26clubs-tracker.fly.dev/api/club?clubName=${encodeURIComponent(clubName)}`);
        if (!response.ok) {
            throw new Error('Club not found');
        }
        const data = await response.json();
        const imageUrl = `https://eafc24.content.easports.com/fifa/fltOnlineAssets/24B23FDE-7835-41C2-87A2-F453DFDB2E82/2024/fcweb/crests/256x256/l${data[0].clubInfo.customKit.crestAssetId}.png`;
        const clubCrest = document.querySelector('.club-info img');

        clubCrest.src = imageUrl;
        clubNameDisplay.textContent = clubName;

        sessionStorage.setItem('clubName', clubName);
        sessionStorage.setItem('clubCrestUrl', imageUrl);


        const clubId = data[0].clubId;
        await getMemberStats(clubId);
        await getClubInfo(clubId);
        await getMatchInfo(clubId);
        return clubId;

    } catch (error) {
        console.error('Error fetching club ID:', error);
    }
}

async function getClubInfo(clubId) {
    try {
        const response = await fetch(`https://fc26clubs-tracker.fly.dev/api/club/info?clubId=${encodeURIComponent(clubId)}`);
        if (!response.ok) {
            throw new Error('Club info not found');
        }
        const data = await response.json();
        const wins = data.wins;
        const draws = data.ties;
        const losses = data.losses;
        const skillRating = data.skillRating;

        document.getElementById('wins').textContent = wins;
        document.getElementById('draws').textContent = draws;
        document.getElementById('losses').textContent = losses;
        document.getElementById('skill-rating').textContent = skillRating;
    } catch (error) {
        console.error('Error fetching club info:', error);
    }
}

async function getMemberStats(clubId) {
    try {
        const response = await fetch(`https://fc26clubs-tracker.fly.dev/api/member?clubId=${encodeURIComponent(clubId)}`);
        if (!response.ok) {
            throw new Error('Club stats not found');
        }
        const data = await response.json();
        const players = data.members;
        sessionStorage.setItem('clubMembers', JSON.stringify(players));
        await appendMemberStats(data);
        
        return data;
    } catch (error) {
        console.error('Error fetching club stats:', error);
    }
}


async function getMatchInfo(clubId){
    try {
        const response =  await fetch(`https://fc26clubs-tracker.fly.dev/api/match/info?clubId=${encodeURIComponent(clubId)}`);
        if(!response.ok){
            throw new Error('Not found');
        }

        const data = await response.json();
        appendRecentGames(data, clubId);
        appendMatchHistory(data, clubId);
    }
    catch(error){
        console.log(error);
    }
}

function appendRecentGames(data,clubId) {  
        const recentGames = data.slice(0,3);

        const recentField = document.querySelector('.grid-games');

        recentField.innerHTML = '';

        recentGames.forEach(matches => {
            let yourTeam;
            let opponent;

            Object.entries(matches.clubs).forEach(([clubIds,club]) => {
                if(clubIds === clubId) {
                    yourTeam = club;
                } else {
                    opponent = club;
                }
            });

            let win = yourTeam.goals > opponent.goals;

            const gameField = document.createElement('div');

            gameField.classList.add('game-field');
            
            gameField.innerHTML = `
            <p>${opponent.details.name}</p>
            <img src='https://eafc24.content.easports.com/fifa/fltOnlineAssets/24B23FDE-7835-41C2-87A2-F453DFDB2E82/2024/fcweb/crests/256x256/l${opponent.details.customKit.crestAssetId}.png'></img>
            <p class='outcome'>${win === true ? 'W' : 'L'}</p>
            <p>${yourTeam.goals} - ${opponent.goals}</p>`
            
            recentField.appendChild(gameField);

            if(win) {
                gameField.querySelector('.outcome').classList.add('win');
            } else {
                gameField.querySelector('.outcome').classList.add('lose');
            }
        });
}

async function appendMemberStats(data) {
    const memberStats = data.members;
    memberList.innerHTML = '';

    const count = memberStats.length;
    document.getElementById('member-count').textContent = count;

    memberStats.forEach(member => {
        const memberField = document.createElement('div');
        memberField.classList.add('member-card');
        memberField.innerHTML= `
        <a id="member-link" href="stats.html?name=${member.name}">${member.name}</a>
        <p>${member.proOverall}</p>`;
        memberList.appendChild(memberField);
    });
}

    async function appendMatchHistory(data, clubId) {
            data.forEach(matches => {
            let yourTeam;
            let opponent;

            Object.entries(matches.clubs).forEach(([clubIds,club]) => {
                if(clubIds === clubId) {
                    yourTeam = club;
                } else {
                    opponent = club;
                }
            });

            const historyCard = document.createElement('div');
            historyCard.className = 'history-card';

            const matchSummary = document.createElement('div');
            matchSummary.className = 'matchSummary';

            const home = document.createElement('div');
            home.className = 'home';

            home.innerHTML = `
            <img src = 'https://eafc24.content.easports.com/fifa/fltOnlineAssets/24B23FDE-7835-41C2-87A2-F453DFDB2E82/2024/fcweb/crests/256x256/l${yourTeam.details.customKit.crestAssetId}.png'>
            <p>${yourTeam.details.name}</p>`;

            const stats = document.createElement('div');
            stats.className = 'stats';

            stats.innerHTML = `${yourTeam.goals} - ${opponent.goals}`;

            const away = document.createElement('div');
            away.className = 'away';

            away.innerHTML = `
            <img src= 'https://eafc24.content.easports.com/fifa/fltOnlineAssets/24B23FDE-7835-41C2-87A2-F453DFDB2E82/2024/fcweb/crests/256x256/l${opponent.details.customKit.crestAssetId}.png'>
            <p>${opponent.details.name}</p>`;

            const button = document.createElement('button');
            button.classList.add('button');
            button.textContent = 'Details';
            button.onclick = () => toggleDetails(button);

            matchSummary.append(home,stats,away,button);

            // Appending advanced details (match-details);

            const matchDetails = document.createElement('div');
            matchDetails.className = 'match-details';

            Object.values(matches.players[clubId]).forEach(player => {
                const row = document.createElement('p');
                row.innerHTML = `<span style='font-weight:bold'>${player.playername} - Goals: ${player.goals} | Assists: ${player.assists} | Rating: ${player.rating}`;
                matchDetails.appendChild(row);
            });

            historyCard.append(matchSummary,matchDetails);

            historyContainer.appendChild(historyCard);

        });



}



