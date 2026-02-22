let map = L.map('map').setView([50.08, 14.42], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let marker = L.marker([50.08, 14.42], {draggable: true}).addTo(map);

const status = document.getElementById('status-bar');
const navOptions = document.getElementById('nav-options');
const shareBtn = document.getElementById('shareBtn');

const urlParams = new URLSearchParams(window.location.search);
const targetLat = urlParams.get('lat');
const targetLon = urlParams.get('lon');

// 1. REŽIM: Někdo mě pozval
if (targetLat && targetLon) {
    status.innerText = "Místo srazu nalezeno! 🎯";
    shareBtn.innerText = "Vytvořit vlastní sraz"; // Změna textu pro hosta
    navOptions.style.display = 'block';
    
    let targetPos = [parseFloat(targetLat), parseFloat(targetLon)];
    map.setView(targetPos, 17);
    marker.setLatLng(targetPos).bindPopup("Tady se sejdeme!").openPopup();
} 
// 2. REŽIM: Já vytvářím sraz
else {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            map.setView([lat, lon], 16);
            marker.setLatLng([lat, lon]);
            status.innerText = "Klikni do mapy pro změnu místa 📍";
        });
    }
}

// FUNKCE: Kliknutí do mapy změní místo srazu
map.on('click', function(e) {
    if (targetLat && targetLon) {
        // Pokud jsme v režimu hosta a klikneme, přepneme se do režimu vytváření
        window.location.href = window.location.pathname; 
        return;
    }
    marker.setLatLng(e.latlng);
    map.panTo(e.latlng);
    status.innerText = "Místo srazu nastaveno! ✨";
});

// FUNKCE: Navigace
function navigate(mode) {
    const lat = targetLat || marker.getLatLng().lat;
    const lon = targetLon || marker.getLatLng().lng;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=${mode}`, '_blank');
}

// FUNKCE: Sdílení
shareBtn.onclick = async () => {
    // Pokud uživatel klikne na "Vytvořit vlastní sraz" v režimu hosta
    if (targetLat && targetLon) {
        window.location.href = window.location.pathname;
        return;
    }

    const pos = marker.getLatLng();
    const shareUrl = `${window.location.origin}${window.location.pathname}?lat=${pos.lat}&lon=${pos.lng}`;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'MeetMe Sraz',
                text: 'Čekám na tebe tady:',
                url: shareUrl
            });
        } catch (err) {
            console.log("Sdílení zrušeno");
        }
    } else {
        prompt("Zkopíruj si odkaz:", shareUrl);
    }
};
