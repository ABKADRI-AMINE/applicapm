using {
    sachin.master as master,
    sachin.transaction as transaction
} from '../db/data';

service TicketsService @(path: 'TicketsService') {

    entity EmployeeSet         as
        projection on master.Employees {
            *,
            Projects
        };

    entity ProjectsSet         as
        projection on master.Projects {
            *,
            Incidents,
            Employees
        };

    entity EmployeeProjectsSet as
        projection on master.EmployeeProjects {
            *,
            Employee,
            Project
        };

    entity TicketsSet          as
        projection on master.Tickets {
            *,
            Details,
            Project,
            Employee
        }
actions {
    action updateStatus() returns TicketsSet;
};
   entity TicketsDataSet as projection on transaction.TicketDetails {
    key Ticket.ID           as Ticket_ID,
    key Ticket.Project.ID   as Ticket_Project_ID,
    key Ticket.Employee.ID  as Ticket_Employee_ID,
    ReportedBy,
    ReportedOn,
    Status,
    ResolutionNotes,
    LastUpdatedBy
}
// actions {
//     action updateStatus() returns TicketsDataSet;
// };

}
