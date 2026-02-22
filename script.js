let map = L.map('map').setView([50.08, 14.42], 13); // Základní Praha
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marker;

const status = document.getElementById('status-bar');
const navOptions = document.getElementById('nav-options');
const shareBtn = document.getElementById('shareBtn');

const urlParams = new URLSearchParams(window.location.search);
const targetLat = urlParams.get('lat');
const targetLon = urlParams.get('lon');

// Pokud přijdeme přes odkaz (někdo nás pozval)
if (targetLat && targetLon) {
    status.innerText = "Cíl nalezen! 🎯";
    shareBtn.style.display = 'none';
    navOptions.style.display = 'block';
    
    let targetPos = [targetLat, targetLon];
    map.setView(targetPos, 16);
    L.marker(targetPos).addTo(map).bindPopup("Tady je sraz!").openPopup();
} else {
    // Pokud aplikaci otevíráme my, abychom sdíleli polohu
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            map.setView([lat, lon], 16);
            marker = L.marker([lat, lon]).addTo(map);
            status.innerText = "Tvoje poloha zaměřena ✅";
        });
    }
}

function navigate(mode) {
    const travelMode = { transit: 'r', walking: 'w', driving: 'd' };
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLon}&travelmode=${mode}`, '_blank');
}

shareBtn.onclick = async () => {
    const center = map.getCenter();
    const shareUrl = `${window.location.origin}${window.location.pathname}?lat=${center.lat}&lon=${center.lng}`;
    
    if (navigator.share) {
        await navigator.share({ title: 'MeetMe Sraz', text: 'Tady mě najdeš:', url: shareUrl });
    } else {
        alert("Odkaz zkopírován: " + shareUrl);
    }
};
