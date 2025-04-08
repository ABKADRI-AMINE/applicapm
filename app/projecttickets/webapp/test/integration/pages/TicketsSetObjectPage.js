sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'projecttickets',
            componentId: 'TicketsSetObjectPage',
            contextPath: '/ProjectsSet/Incidents'
        },
        CustomPageDefinitions
    );
});