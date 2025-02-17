import { Component, OnInit, inject } from "@angular/core";
import { Task } from "../Model/Task";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { TaskService } from "../Services/task.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  showCreateTaskForm: boolean = false;
  showTaskDetails: boolean = false;
  http: HttpClient = inject(HttpClient);
  allTasks: Task[] = [];
  taskService: TaskService = inject(TaskService);
  currentTaskId: string = "";
  isLoading: boolean = false;

  currentTask: Task | null = null;

  errorMessage: string | null = null;

  editMode: boolean = false;
  selectedTask: Task;

  errorSub: Subscription;

  ngOnInit() {
    this.fetchAllTasks();
    this.errorSub = this.taskService.errorSubject.subscribe({
      next: (httpError) => {
        this.setErrorMessage(httpError);
      },
    });
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

  OpenCreateTaskForm() {
    this.showCreateTaskForm = true;
    this.editMode = false;
    this.selectedTask = {
      title: "",
      desc: "",
      assignedTo: "",
      createdAt: "",
      priority: "",
      status: "",
    };
  }

  showCurrentTaskDetails(id: string | undefined) {
    this.showTaskDetails = true;
    this.taskService.getTaskDetails(id).subscribe({
      next: (data: Task) => {
        this.currentTask = data;
      },
    });
  }

  CloseTaskDetails() {
    this.showTaskDetails = false;
  }

  CloseCreateTaskForm() {
    this.showCreateTaskForm = false;
  }

  CreateOrUpdateTask(data: Task) {
    if (!this.editMode) {
      this.taskService.CreateTask(data);
      this.fetchAllTasks();
    } else {
      this.taskService.UpdateTask(this.currentTaskId, data);
      this.fetchAllTasks();
    }
  }

  /*{
    key1: {},
    key2: {}
  }*/

  FetchAllTaskClicked() {
    this.fetchAllTasks();
  }

  private fetchAllTasks() {
    this.isLoading = true;
    this.taskService.GetAlltasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.isLoading = false;
      },
      error: (error) => {
        this.setErrorMessage(error);
        this.isLoading = false;
      },
    });
  }

  private setErrorMessage(err: HttpErrorResponse) {
    console.log(err);
    if (err.error.error === "Permission denied") {
      this.errorMessage = "hasina KHUNI..Hasinar fasi chai";
    } else if (err.error.error === "404 Not Found") {
      this.errorMessage = "hasina PALAISE HASINA MODIR BOU";
    } else {
      this.errorMessage = err.message;
    }

    setTimeout(() => {
      this.errorMessage = null;
    }, 9000);
  }

  DeleteTask(id: string | undefined) {
    this.taskService.DeleteTask(id);
    this.fetchAllTasks();
  }

  DeleteAllTask() {
    this.taskService.DeleteAllTasks();
    this.fetchAllTasks();
  }

  OnEditTaskClicked(id: string | undefined) {
    this.currentTaskId = id;

    //OPEN EDIT TASK FORM
    this.showCreateTaskForm = true;
    this.editMode = true;

    this.selectedTask = this.allTasks.find((task) => {
      return task.id === id;
    });
  }
}
