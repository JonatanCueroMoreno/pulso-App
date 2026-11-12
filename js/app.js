document.addEventListener('alpine:init', () => {
    Alpine.data('pulsoApp', () => ({ 
          activeTab: 'dashboard',
          selectedUser: 'pepito',
          usersData: {
              pepito: { name: 'Pepito (21 años, Comuna 12)', role: 'Joven • Repuesto y Celulares', audioText: 'Nota de voz: Hola, sé reparar celulares, manejar redes y aprender rápido. Busco mi primera oportunidad sin experiencia formal.', matchScore: '94%', company: 'Comercializadora El Puerto (Comuna 7)', roleMatch: 'Soporte Digital Barrial', stipend: '$150.000 COP + Conectividad' },
              marta: { name: 'Marta (Madre Cabeza de Hogar, Comuna 7)', role: 'Gastronomía & Cuidados', audioText: 'Nota de voz: Cocino para eventos masivos y administro negocios. Mis horarios dependen del cuidado de mis hijos.', matchScore: '92%', company: 'Restaurante Mar y Sabor (Comuna 10)', roleMatch: 'Auxiliar de Cocina & Logística', stipend: '$140.000 COP + Ludoteca Inclusiva' },
              camila: { name: 'Camila (Persona con Discapacidad, Comuna 5)', role: 'Diseño & Atención Chat', audioText: 'Nota de voz: Tengo habilidades de diseño y atención al cliente por chat. Requiero ajustes razonables de accesibilidad.', matchScore: '95%', company: 'Logística Pacífico S.A. (Comuna 5)', roleMatch: 'Gestora de Canales Digitales Inclusivos', stipend: 'Modalidad Remota + Ajustes Ley 1618' }
          },
          waStep: 0,
          waMessages: [],
          matchResult: null,
          
          initSimulator() {
              this.resetWa();
          },
          sendAudioNote() {
              const current = this.usersData[this.selectedUser];
              this.waMessages.push({ sender: 'user', text: current.audioText });
              this.waStep = 1;
              setTimeout(() => {
                  this.waMessages.push({ sender: 'bot', text: 'Perfil de ejemplo registrado en el simulador. Esta demostración no usa inteligencia artificial ni analiza solicitudes reales. ¿Seguimos con el ejemplo?' });
              }, 1000);
          },
          confirmMatch() {
              const current = this.usersData[this.selectedUser];
              this.waMessages.push({ sender: 'user', text: 'Sí, confirmo disponibilidad y condiciones.' });
              this.waStep = 2;
              setTimeout(() => {
                  this.waMessages.push({ sender: 'bot', text: 'Coincidencia orientativa de ejemplo (' + current.matchScore + ', no medida). Lugar de trabajo sin confirmar: ' + current.company + '. Trabajo de muestra: ' + current.roleMatch + '. Apoyo sugerido, no ofrecido: ' + current.stipend + '.' });
                  this.matchResult = { score: current.matchScore, company: current.company, role: current.roleMatch, stipend: current.stipend };
              }, 1200);
          },
          resetWa() {
              this.waStep = 0;
              this.matchResult = null;
              this.waMessages = [
                  { sender: 'bot', text: '¡Hola! Estás viendo un ejemplo de PULSO Buenaventura. La propuesta busca acercar lo que sabes hacer a oportunidades de trabajo. Perfil de muestra: ' + this.usersData[this.selectedUser].name + '. ¿Vemos cómo podría funcionar?' }
              ];
          },
          
          initMap() {
              setTimeout(() => {
                  if(window.mapInitialized) return;
                  let map = L.map('map').setView([3.8801, -77.0312], 13);
                  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                      maxZoom: 19,
                      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors • PULSO Cívico'
                  }).addTo(map);

                  let comunas = [
                      { name: 'Comuna 10 (zona de ejemplo)', lat: 3.8750, lon: -77.0280, vacancies: 34, talent: 450, color: '#00685f' },
                      { name: 'Comuna 12 (zona de ejemplo)', lat: 3.8680, lon: -77.0400, vacancies: 16, talent: 240, color: '#a36700' },
                      { name: 'Comuna 7 (zona de ejemplo)', lat: 3.8850, lon: -77.0200, vacancies: 22, talent: 240, color: '#00685f' },
                      { name: 'Comuna 5 (zona de ejemplo)', lat: 3.8920, lon: -77.0150, vacancies: 14, talent: 310, color: '#00685f' }
                  ];

                  comunas.forEach(c => {
                      let circle = L.circle([c.lat, c.lon], {
                          color: c.color,
                          fillColor: c.color,
                          fillOpacity: 0.5,
                          radius: 450
                      }).addTo(map);
                      circle.bindPopup('<b>' + c.name + '</b><br>Oportunidades de muestra: ' + c.vacancies + '<br>Perfiles de muestra: ' + c.talent + '<br><em>Cifras ilustrativas; no son registros reales.</em>');
                  });
                  window.mapInitialized = true;
              }, 300);
          },

          safetyAlerts: [
              { id: 1, title: 'Taller de ejemplo (Comuna 10)', status: 'Estado de muestra; no verificado', color: 'text-terracota' },
              { id: 2, title: 'Negocio de ejemplo (Comuna 7)', status: 'Revisión pendiente; no es un aliado confirmado', color: 'text-terracota' },
              { id: 3, title: 'Ejemplo de oferta dudosa', status: 'Caso ilustrativo; no es una alerta real', color: 'text-terracota' }
          ],
          reportSent: false
      }));
});
