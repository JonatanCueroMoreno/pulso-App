document.addEventListener('alpine:init', () => {
    Alpine.data('pulsoApp', () => ({ 
          activeTab: 'dashboard',
          selectedUser: 'pepito',
          usersData: {
              pepito: { name: 'Pepito (21 años, Comuna 12)', role: 'Joven • Repuesto y Celulares', audioText: 'Nota de voz: Hola, sé reparar celulares, manejar redes y aprender rápido. Busco mi primera oportunidad sin experiencia formal.', schedule: 'Flexible', modality: 'Presencial', accessibility: 'Instrucciones paso a paso', matchScore: '94%', company: 'Comercializadora El Puerto (Comuna 7)', roleMatch: 'Soporte Digital Barrial', stipend: '$150.000 COP + Conectividad' },
              marta: { name: 'Marta (Madre Cabeza de Hogar, Comuna 7)', role: 'Gastronomía & Cuidados', audioText: 'Nota de voz: Cocino para eventos masivos y administro negocios. Mis horarios dependen del cuidado de mis hijos.', schedule: 'Diurno', modality: 'Presencial', accessibility: 'Horario compatible con cuidado', matchScore: '92%', company: 'Restaurante Mar y Sabor (Comuna 10)', roleMatch: 'Auxiliar de Cocina & Logística', stipend: '$140.000 COP + Ludoteca Inclusiva' },
              camila: { name: 'Camila (Persona con Discapacidad, Comuna 5)', role: 'Diseño & Atención Chat', audioText: 'Nota de voz: Tengo habilidades de diseño y atención al cliente por chat. Requiero ajustes razonables de accesibilidad.', schedule: 'Flexible', modality: 'Remota', accessibility: 'Herramientas compatibles con lector de pantalla', matchScore: '95%', company: 'Logística Pacífico S.A. (Comuna 5)', roleMatch: 'Gestora de Canales Digitales Inclusivos', stipend: 'Modalidad Remota + Ajustes Ley 1618' }
          },
          scheduleOptions: ['Diurno', 'Nocturno', 'Flexible'],
          modalityOptions: ['Presencial', 'Híbrida', 'Remota'],
          accessibilityOptions: {
              pepito: ['Ningún apoyo por ahora', 'Instrucciones paso a paso', 'Capacitación con acompañamiento'],
              marta: ['Horario compatible con cuidado', 'Pausas flexibles', 'Apoyo para el cuidado durante la jornada'],
              camila: ['Ningún ajuste por ahora', 'Herramientas compatibles con lector de pantalla', 'Navegación por teclado', 'Subtítulos e instrucciones escritas', 'Ajustes en el puesto de trabajo']
          },
          waStep: 0,
          waMessages: [],
          matchResult: null,
          
          initSimulator() {
              this.resetWa();
          },
          sendAudioNote() {
              const current = this.usersData[this.selectedUser];
              this.waMessages.push({
                  sender: 'user',
                  text: current.audioText + ' Mis preferencias: horario ' + current.schedule.toLowerCase() +
                      ', modalidad ' + current.modality.toLowerCase() + ' y apoyo: ' + current.accessibility.toLowerCase() + '.'
              });
              this.waStep = 1;
              setTimeout(() => {
                  this.waMessages.push({
                      sender: 'bot',
                      text: 'Gracias por contarnos tus preferencias. Tendremos en cuenta el horario ' +
                          current.schedule.toLowerCase() + ', la modalidad ' + current.modality.toLowerCase() +
                          ' y el apoyo que elegiste: ' + current.accessibility.toLowerCase() +
                          '. ¿Quieres ver un empleo de ejemplo con estas condiciones?'
                  });
              }, 1000);
          },
          confirmMatch() {
              const current = this.usersData[this.selectedUser];
              this.waMessages.push({ sender: 'user', text: 'Sí, quiero ver una sugerencia según mis preferencias.' });
              this.waStep = 2;
              setTimeout(() => {
                  const response = 'Según tus preferencias de horario ' + current.schedule.toLowerCase() +
                      ' y modalidad ' + current.modality.toLowerCase() + ', te mostramos el empleo de muestra "' +
                      current.roleMatch + '". El lugar no está confirmado: ' + current.company +
                      '. Ajuste solicitado: ' + current.accessibility +
                      '. Hay que revisar con el lugar si pueden ofrecer estas condiciones; no es una oferta real.';
                  this.waMessages.push({ sender: 'bot', text: response });
                  this.matchResult = {
                      score: current.matchScore,
                      company: current.company,
                      role: current.roleMatch,
                      stipend: current.stipend,
                      schedule: current.schedule,
                      modality: current.modality,
                      accessibility: current.accessibility
                  };
              }, 1200);
          },
          resetWa() {
              this.waStep = 0;
              this.matchResult = null;
              this.waMessages = [
                  { sender: 'bot', text: '¡Hola! Estás viendo un ejemplo de PULSO Buenaventura. Perfil de muestra: ' + this.usersData[this.selectedUser].name + '. Puedes elegir horario, modalidad y apoyos de accesibilidad. ¿Vemos cómo podría funcionar?' }
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
