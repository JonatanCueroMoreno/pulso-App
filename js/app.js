document.addEventListener('alpine:init', () => {
    Alpine.data('pulsoApp', () => ({ 
          activeTab: 'dashboard',
          selectedUser: 'pepito',
          usersData: {
              pepito: { name: 'Pepito (21 años, Comuna 12)', role: 'Joven • Repuesto y Celulares', audioText: 'Nota de voz: Hola, sé reparar celulares, manejar redes y aprender rápido. Busco mi primera oportunidad sin experiencia formal.', schedule: 'Flexible', modality: 'Presencial', accessibility: 'Instrucciones paso a paso', roleMatch: 'Soporte digital' },
              marta: { name: 'Marta (Madre Cabeza de Hogar, Comuna 7)', role: 'Gastronomía & Cuidados', audioText: 'Nota de voz: Cocino para eventos masivos y administro negocios. Mis horarios dependen del cuidado de mis hijos.', schedule: 'Diurno', modality: 'Presencial', accessibility: 'Horario compatible con cuidado', roleMatch: 'Cocina y apoyo logístico' },
              camila: { name: 'Camila (Persona con Discapacidad, Comuna 5)', role: 'Diseño & Atención Chat', audioText: 'Nota de voz: Tengo habilidades de diseño y atención al cliente por chat. Requiero ajustes razonables de accesibilidad.', schedule: 'Flexible', modality: 'Remota', accessibility: 'Herramientas compatibles con lector de pantalla', roleMatch: 'Diseño y atención digital accesible' }
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
                      text: 'Gracias por contarnos tus preferencias. En esta conversación tendremos en cuenta el horario ' +
                          current.schedule.toLowerCase() + ', la modalidad ' + current.modality.toLowerCase() +
                          ' y el apoyo que elegiste: ' + current.accessibility.toLowerCase() +
                      '. ¿Quieres recibir una orientación laboral relacionada con tu perfil?'
                  });
              }, 1000);
          },
          confirmMatch() {
              const current = this.usersData[this.selectedUser];
              this.waMessages.push({ sender: 'user', text: 'Sí, quiero ver una sugerencia según mis preferencias.' });
              this.waStep = 2;
              setTimeout(() => {
                  const response = 'Tomamos nota de tu preferencia de horario ' + current.schedule.toLowerCase() +
                      ', modalidad ' + current.modality.toLowerCase() + ' y apoyo de accesibilidad: ' +
                      current.accessibility + '. Por tus habilidades, podrías explorar puestos relacionados con "' +
                      current.roleMatch + '". PULSO no tiene vacantes conectadas y no puede confirmar empleadores ni condiciones actuales.';
                  this.waMessages.push({ sender: 'bot', text: response });
                  this.matchResult = {
                      role: current.roleMatch,
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
                  { sender: 'bot', text: 'Hola. Este perfil de prueba te ayuda a explorar opciones de trabajo. Elige horario, modalidad y apoyos de accesibilidad para recibir orientación. PULSO aún no consulta vacantes.' }
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

                  window.mapInitialized = true;
              }, 300);
          },

          safetyAlerts: [],
          reportSent: false
      }));
});
