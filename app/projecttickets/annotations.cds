using TicketsService as service from '../../srv/TicketsSrv';

annotate service.ProjectsSet with @(
    UI.SelectionFields: [
        ID,
        Client
    ],
    UI.LineItem: [
        {
            $Type: 'UI.DataField',
            Value: ID
        },
        {
            $Type: 'UI.DataField',
            Value: Name
        },
        {
            $Type: 'UI.DataField',
            Value: Client
        }
    ],
    UI.HeaderInfo: {
        TypeName: 'Projects',
        TypeNamePlural: 'Projects List',
        Title: {
            $Type: 'UI.DataField',
            Value: ID
        },
        Description: {
            $Type: 'UI.DataField',
            Value: Client
        }
    },
    UI.Facets: [
        {
            $Type: 'UI.CollectionFacet',
            Label: 'Project Data',
            Facets: [
                {
                    $Type: 'UI.ReferenceFacet',
                    Target: '@UI.Identification'
                },
                {
                    $Type: 'UI.ReferenceFacet',
                    Target: 'Incidents/@UI.LineItem#Tickets'
                }
            ]
        }
    ],
    UI.Identification: [
        {
            $Type: 'UI.DataField',
            Value: Client
        },
        {
            $Type: 'UI.DataField',
            Value: Name
        },
        {
            $Type: 'UI.DataField',
            Value: StartDate
        },
        {
            $Type: 'UI.DataField',
            Value: EndDate
        },
        {
            $Type: 'UI.DataField',
            Value: Budget
        }
    ]
);

annotate service.TicketsSet with @(
    UI.LineItem #Tickets: [
        {
            $Type: 'UI.DataField',
            Value: ID
        },
        {
            $Type: 'UI.DataField',
            Value: Project_ID
        },
        {
            $Type: 'UI.DataField',
            Value: Description
        },
        {
            $Type: 'UI.DataField',
            Value: Priority
        }
    ],
    UI.HeaderInfo: {
        TypeName: 'Ticket',
        TypeNamePlural: 'Ticket Data',
        Title: {
            $Type: 'UI.DataField',
            Value: ID
        },
        Description: {
            $Type: 'UI.DataField',
            Value: Description
        }
    },
    UI.Facets: [
        {
            $Type: 'UI.CollectionFacet',
            Label: 'Ticket Status',
            Facets: [
                {
                    $Type: 'UI.ReferenceFacet',
                    Target: ![@UI.Identification#TICKETDATA],
                    Label: 'Ticket Status'
                },
                {
                    $Type: 'UI.ReferenceFacet',
                    Target: ![@UI.FieldGroup#updateStatus],
                    Label: 'Ticket Status'
                }
            ]
        }
    ],
    UI.Identification #TICKETDATA: [
        {
            $Type: 'UI.DataField',
            Value: Employee_ID
        },
        {
            $Type: 'UI.DataField',
            Value: Employee.FirstName
        },
        {
            $Type: 'UI.DataField',
            Value: Employee.LastName
        },
        {
            $Type: 'UI.DataField',
            Value: Employee.Email
        },
        {
            $Type: 'UI.DataField',
            Value: Details.Status
        },
        {
            $Type: 'UI.DataField',
            Value: Priority
        }
    ],
    UI.FieldGroup #updateStatus: {
        Data: [
            {
                $Type: 'UI.DataFieldForAction',
                Action: 'TicketsService.updateStatus',
                Label: 'Update Status'
            }
        ]
    }
);

annotate service.TicketsDataSet with @(
    UI.FieldGroup #updateStatus: {
        Data: [
            {
                $Type: 'UI.DataFieldForAction',
                Action: 'TicketsService.updateStatus',
                Label: 'Update Status'
            }
        ]
    }
);
