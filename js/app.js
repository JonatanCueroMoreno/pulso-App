document.addEventListener('alpine:init', () => {
    Alpine.data('pulsoApp', () => ({ 
          activeTab: 'dashboard',
          selectedUser: 'pepito',
          usersData: {
              pepito: { name: 'Pepito (21 años, Comuna 12)', role: 'Joven • Repuesto y Celulares', audioText: '🎵 [Nota de voz] Hola, sé reparar celulares, manejar redes y aprender rápido. Busco mi primera oportunidad sin experiencia formal.', matchScore: '94%', company: 'Comercializadora El Puerto (Comuna 7)', roleMatch: 'Soporte Digital Barrial', stipend: '$150.000 COP + Conectividad' },
              marta: { name: 'Marta (Madre Cabeza de Hogar, Comuna 7)', role: 'Gastronomía & Cuidados', audioText: '🎵 [Nota de voz] Cocino para eventos masivos y administro negocios. Mis horarios dependen del cuidado de mis hijos.', matchScore: '92%', company: 'Restaurante Mar y Sabor (Comuna 10)', roleMatch: 'Auxiliar de Cocina & Logística', stipend: '$140.000 COP + Ludoteca Inclusiva' },
              camila: { name: 'Camila (Persona con Discapacidad, Comuna 5)', role: 'Diseño & Atención Chat', audioText: '🎵 [Nota de voz] Tengo habilidades de diseño y atención al cliente por chat. Requiero ajustes razonables de accesibilidad.', matchScore: '95%', company: 'Logística Pacífico S.A. (Comuna 5)', roleMatch: 'Gestora de Canales Digitales Inclusivos', stipend: 'Modalidad Remota + Ajustes Ley 1618' }
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
                  this.waMessages.push({ sender: 'bot', text: '✅ ¡Perfil extraído con éxito por IA! Sin hojas de vida. Detectamos tus destrezas y tus condiciones de horario/apoyo. ¿Confirmamos disponibilidad en tu comuna?' });
              }, 1000);
          },
          confirmMatch() {
              const current = this.usersData[this.selectedUser];
              this.waMessages.push({ sender: 'user', text: '👍 Sí, confirmo disponibilidad y condiciones.' });
              this.waStep = 2;
              setTimeout(() => {
                  this.waMessages.push({ sender: 'bot', text: '🎉 ¡MATCH EXPLICABLE EXITOSO (' + current.matchScore + ' Afinidad)! Empresa verif.: ' + current.company + '. Oportunidad: ' + current.roleMatch + '. Beneficio: ' + current.stipend + '.' });
                  this.matchResult = { score: current.matchScore, company: current.company, role: current.roleMatch, stipend: current.stipend };
              }, 1200);
          },
          resetWa() {
              this.waStep = 0;
              this.matchResult = null;
              this.waMessages = [
                  { sender: 'bot', text: '¡Hola! Bienvenido a PULSO Buenaventura 🌊. Conectamos tus capacidades reales con empleos y encargos sin hoja de vida. Estás simulando a: ' + this.usersData[this.selectedUser].name + '. ¿Cómo prefieres registrarte?' }
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
                      { name: 'Comuna 10 (Foco Actual)', lat: 3.8750, lon: -77.0280, vacancies: 34, talent: 450, color: '#00685f' },
                      { name: 'Comuna 12 (Talleres)', lat: 3.8680, lon: -77.0400, vacancies: 16, talent: 240, color: '#a36700' },
                      { name: 'Comuna 7 (Comercio)', lat: 3.8850, lon: -77.0200, vacancies: 22, talent: 240, color: '#00685f' },
                      { name: 'Comuna 5 (Logística)', lat: 3.8920, lon: -77.0150, vacancies: 14, talent: 310, color: '#00685f' }
                  ];

                  comunas.forEach(c => {
                      let circle = L.circle([c.lat, c.lon], {
                          color: c.color,
                          fillColor: c.color,
                          fillOpacity: 0.5,
                          radius: 450
                      }).addTo(map);
                      circle.bindPopup('<b>' + c.name + '</b><br>Vacantes activas: ' + c.vacancies + '<br>Talento disponible: ' + c.talent);
                  });
                  window.mapInitialized = true;
              }, 300);
          },

          safetyAlerts: [
              { id: 1, title: 'Taller Don Amador (Comuna 10)', status: 'Verificado (NIT & Inspección física)', color: 'text-tealPortuario' },
              { id: 2, title: 'Comercializadora Pacífico (Comuna 7)', status: 'Verificado & Con aval comunitario', color: 'text-tealPortuario' },
              { id: 3, title: 'Alerta Reportada: Oferta dudosa sin NIT', status: 'Bloqueada por moderación PULSO', color: 'text-red-600' }
          ],
          reportSent: false
      }));
});
