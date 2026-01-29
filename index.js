const searchBox = document.querySelector('.search input');
const searchButton = document.querySelector('.search button');
const clubNameDisplay = document.querySelector('.club-name h2');

searchButton.addEventListener('click', async () => {
    const clubName = searchBox.value;
    const clubId = await getClubId(clubName);
    console.log(`Club ID for ${clubName}: ${clubId}`);
});

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
        console.log('Club Info:', data);
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
        console.log('Club Stats:', data);

        return data;
    } catch (error) {
        console.error('Error fetching club stats:', error);
    }
}

async function appendMemberStats(data) {
    const memberStats = data.members;
    const memberList = document.querySelector('.member-stats-container');
    memberList.innerHTML = '';

    const count = memberStats.length;
    document.getElementById('member-count').textContent = count;

    memberStats.forEach(member => {
        const memberField = document.createElement('div');
        memberField.classList.add('member-card');
        memberField.innerHTML= `
        <a href="stats.html?name=${member.name}">${member.name}</a>
        <p>${member.proOverall}</p>`;
        memberList.appendChild(memberField);
    });
}



