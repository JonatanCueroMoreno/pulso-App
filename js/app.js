document.addEventListener('alpine:init', () => {
    Alpine.data('pulsoApp', () => ({ 
          activeTab: 'dashboard',
          selectedUser: 'pepito',
          usersData: {
              pepito: { name: 'Pepito (21 años, Comuna 12)', role: 'Joven • Repuesto y Celulares', audioText: 'Nota de voz: Hola, sé reparar celulares, manejar redes y aprender rápido. Busco mi primera oportunidad sin experiencia formal.', schedule: 'Flexible', modality: 'Presencial', accessibility: 'Instrucciones paso a paso', roleMatch: 'Soporte digital' },
              marta: { name: 'Marta (Madre Cabeza de Hogar, Comuna 7)', role: 'Gastronomía & Cuidados', audioText: 'Nota de voz: Cocino para eventos masivos y administro negocios. Mis horarios dependen del cuidado de mis hijos.', schedule: 'Diurno', modality: 'Presencial', accessibility: 'Horario compatible con cuidado', roleMatch: 'Cocina y apoyo logístico' },
              camila: { name: 'Camila (Persona con Discapacidad, Comuna 5)', role: 'Diseño & Atención Chat', audioText: 'Nota de voz: Tengo habilidades de diseño y atención al cliente por chat. Requiero ajustes razonables de accesibilidad.', schedule: 'Flexible', modality: 'Remota', accessibility: 'Herramientas compatibles con lector de pantalla', roleMatch: 'Diseño y atención digital accesible' }
          },
          jobSuggestions: [
              { userId: 'pepito', title: 'Reparación básica de celulares', area: 'Tecnología y soporte' },
              { userId: 'pepito', title: 'Apoyo en redes sociales para negocios', area: 'Tecnología y soporte' },
              { userId: 'pepito', title: 'Asistente de soporte digital barrial', area: 'Tecnología y soporte' },
              { userId: 'marta', title: 'Auxiliar de cocina para eventos', area: 'Gastronomía y logística' },
              { userId: 'marta', title: 'Apoyo en preparación de alimentos', area: 'Gastronomía y logística' },
              { userId: 'marta', title: 'Asistente de logística comunitaria', area: 'Gastronomía y logística' },
              { userId: 'camila', title: 'Diseño gráfico para canales digitales', area: 'Diseño y atención digital' },
              { userId: 'camila', title: 'Atención al cliente por chat', area: 'Diseño y atención digital' },
              { userId: 'camila', title: 'Asistente de contenidos accesibles', area: 'Diseño y atención digital' }
          ],
          offerMarkerProfiles: [
              { userId: 'pepito', icon: 'bi-phone-fill', offset: [0, 0] },
              { userId: 'marta', icon: 'bi-egg-fried', offset: [0.0016, 0.0018] },
              { userId: 'camila', icon: 'bi-laptop-fill', offset: [-0.0016, 0.0018] }
          ],
          currentTime: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          clockTimer: null,
          get employmentAnalytics() {
              const profiles = Object.entries(this.usersData).map(([userId, user]) => ({
                  userId,
                  name: user.name.split(' (')[0],
                  count: this.jobSuggestions.filter(suggestion => suggestion.userId === userId).length
              }));
              const areaCounts = this.jobSuggestions.reduce((counts, suggestion) => {
                  counts[suggestion.area] = (counts[suggestion.area] || 0) + 1;
                  return counts;
              }, {});
              const areas = Object.entries(areaCounts)
                  .map(([name, count]) => ({ name, count }))
                  .sort((first, second) => second.count - first.count);

              return {
                  profileCount: profiles.length,
                  suggestionCount: this.jobSuggestions.length,
                  profiles,
                  areas,
                  maxProfileCount: Math.max(1, ...profiles.map(profile => profile.count)),
                  maxAreaCount: Math.max(1, ...areas.map(area => area.count))
              };
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
          startClock() {
              if (this.clockTimer) return;
              this.clockTimer = setInterval(() => {
                  this.currentTime = new Date().toLocaleTimeString('es-CO', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                  });
              }, 1000);
          },
          destroy() {
              if (this.clockTimer) clearInterval(this.clockTimer);
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
                      text: 'Gracias por contarnos tus preferencias. En esta conversación tendremos en cuenta el horario ' +
                          current.schedule.toLowerCase() + ', la modalidad ' + current.modality.toLowerCase() +
                          ' y el apoyo que elegiste: ' + current.accessibility.toLowerCase() +
                      '. ¿Quieres recibir una orientación laboral relacionada con tu perfil?'
                  });
              }, 1000);
          },
          confirmMatch() {
              const selectedUser = this.selectedUser;
              const current = this.usersData[selectedUser];
              this.waMessages.push({ sender: 'user', text: 'Sí, quiero ver una sugerencia según mis preferencias.' });
              this.waStep = 2;
              setTimeout(() => {
                  const suggestions = this.jobSuggestions.filter(suggestion => suggestion.userId === selectedUser);
                  const response = 'Tomamos nota de tu preferencia de horario ' + current.schedule.toLowerCase() +
                      ', modalidad ' + current.modality.toLowerCase() + ' y apoyo de accesibilidad: ' +
                      current.accessibility + '. Por tus habilidades, podrías explorar puestos relacionados con "' +
                      current.roleMatch + '". Opciones orientativas (no son vacantes reales):';
                  this.waMessages.push({ sender: 'bot', text: response, suggestions });
                  this.matchResult = {
                      role: current.roleMatch,
                      schedule: current.schedule,
                      modality: current.modality,
                      accessibility: current.accessibility,
                      suggestions
                  };
              }, 1200);
          },
          resetWa() {
              this.waStep = 0;
              this.matchResult = null;
              this.waMessages = [
                  { sender: 'bot', text: 'Hola. Este perfil de prueba te ayuda a explorar opciones de trabajo. Elige horario, modalidad y apoyos de accesibilidad para recibir orientación. PULSO aún no consulta vacantes.' }
              ];
          },
          
          initMap() {
              this.startClock();
              setTimeout(() => {
                  if(window.mapInitialized) return;
                  const referencePoint = [3.8801, -77.0312];
                  const map = L.map('map').setView(referencePoint, 14);
                  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                      maxZoom: 19,
                      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors • PULSO Cívico'
                  }).addTo(map);

                  this.offerMarkerProfiles.forEach(profile => {
                      const user = this.usersData[profile.userId];
                      const suggestions = this.jobSuggestions.filter(suggestion => suggestion.userId === profile.userId);
                      const popup = document.createElement('div');
                      const title = document.createElement('strong');
                      const list = document.createElement('ul');
                      const note = document.createElement('p');

                      title.textContent = user.name.split(' (')[0] + ' · Opciones sugeridas';
                      suggestions.forEach(suggestion => {
                          const item = document.createElement('li');
                          item.textContent = suggestion.title;
                          list.appendChild(item);
                      });
                      note.textContent = 'Solo lectura. Ejemplos ficticios; no son vacantes reales. Punto de referencia visual, no ubicación de un empleo.';
                      popup.append(title, list, note);

                      const icon = L.divIcon({
                          className: 'offer-map-marker-container',
                          html: '<span class="offer-map-marker" aria-hidden="true"><i class="bi ' + profile.icon + '"></i></span>',
                          iconSize: [40, 40],
                          iconAnchor: [20, 20]
                      });
                      const position = [
                          referencePoint[0] + profile.offset[0],
                          referencePoint[1] + profile.offset[1]
                      ];

                      L.marker(position, {
                          icon,
                          title: 'Ver opciones de ' + user.name.split(' (')[0] + ' (solo lectura)'
                      }).bindPopup(popup, { maxWidth: 280 }).addTo(map);
                  });

                  window.mapInitialized = true;
              }, 300);
          },

          safetyAlerts: [],
          reportSent: false
      }));
});
