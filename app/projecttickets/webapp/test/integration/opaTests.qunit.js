sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'projecttickets/test/integration/FirstJourney',
		'projecttickets/test/integration/pages/ProjectsSetList',
		'projecttickets/test/integration/pages/ProjectsSetObjectPage',
		'projecttickets/test/integration/pages/TicketsSetObjectPage'
    ],
    function(JourneyRunner, opaJourney, ProjectsSetList, ProjectsSetObjectPage, TicketsSetObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('projecttickets') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheProjectsSetList: ProjectsSetList,
					onTheProjectsSetObjectPage: ProjectsSetObjectPage,
					onTheTicketsSetObjectPage: TicketsSetObjectPage
                }
            },
            opaJourney.run
        );
    }
);