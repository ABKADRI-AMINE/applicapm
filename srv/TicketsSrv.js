const cds = require('@sap/cds');

module.exports = cds.service.impl(async function (srv) {
  // Utiliser la projection contenant le champ "Status"
  const { TicketsDataSet } = this.entities;

  srv.on('updateStatus', async (req) => {
    // Tableau pour collecter les messages destinés à l'utilisateur
    let messages = [];
    const addMsg = (msg) => {
      messages.push(msg);
      console.log(msg);
    };

    addMsg('✅ Action updateStatus called');

    // Récupération initiale du binding (req.params[0])
    let keys = req.params[0];
    addMsg('📌 Clés initiales de req.params[0]: ' + JSON.stringify(keys));

    // Si keys n'est pas un objet (ex. c'est une string), extraire les clés de l'URL
    if (typeof keys !== 'object') {
      const url = req._ && req._.req && req._.req.url;
      addMsg('📌 URL de la requête: ' + url);
      if (url) {
        const match = url.match(/\/Incidents\(([^)]+)\)/);
        if (match && match[1]) {
          const keyString = match[1];
          keys = {};
          keyString.split(',').forEach(pair => {
            const [k, v] = pair.split('=');
            if (k && v) {
              keys[k.trim()] = v.trim().replace(/^'(.*)'$/, '$1');
            }
          });
          addMsg('📌 Clés extraites depuis l’URL: ' + JSON.stringify(keys));
        }
      }
    }

    // Vérifier que les clés attendues sont présentes
    const { ID, Project_ID, Employee_ID } = keys;
    if (!ID || !Project_ID || !Employee_ID) {
      addMsg('❌ Clés incomplètes: ' + JSON.stringify(keys));
      return req.error(400, 'Clés incomplètes: ' + JSON.stringify(keys));
    }

    // Mapping : TicketsDataSet attend ces clés sous ces noms
    const Ticket_ID = ID;
    const Ticket_Project_ID = Project_ID;
    const Ticket_Employee_ID = Employee_ID;

    const db = srv.transaction(req);

    // Recherche du ticket dans TicketsDataSet
    const ticketDetail = await db.run(
      SELECT.one.from(TicketsDataSet).where({
        Ticket_ID,
        Ticket_Project_ID,
        Ticket_Employee_ID
      })
    );

    if (!ticketDetail) {
      addMsg('❌ Ticket details not found');
      return req.error(404, 'Ticket details not found. ' + JSON.stringify(messages));
    }

    const currentStatus = ticketDetail.Status;
    let newStatus;

    switch (currentStatus) {
      case 'O': newStatus = 'H'; break;
      case 'H': newStatus = 'C'; break;
      case 'C':
        addMsg('❌ Ticket already closed');
        return req.error(400, 'Ticket already closed');
      default: newStatus = 'O';
    }

    addMsg(`🔁 Mise à jour du statut : ${currentStatus} → ${newStatus}`);

    // Mise à jour uniquement dans TicketsDataSet (qui contient Status)
    await db.run(
      UPDATE(TicketsDataSet).set({
        Status: newStatus,
        LastUpdatedBy: req.user?.id || 'system'
      }).where({
        Ticket_ID,
        Ticket_Project_ID,
        Ticket_Employee_ID
      })
    );

    // Rechargement du ticket mis à jour
    const updated = await db.run(
      SELECT.one.from(TicketsDataSet).where({
        Ticket_ID,
        Ticket_Project_ID,
        Ticket_Employee_ID
      })
    );

    addMsg('✅ Nouveau statut enregistré : ' + JSON.stringify(updated));
    addMsg('✅ Statut mis à jour avec succès');

    // Inclure les messages dans la réponse pour affichage à l'utilisateur
    updated.logMessages = messages;
    updated.message = "✅ Statut mis à jour avec succès";
    return updated;
  });
});
