class Admin::TasksController < ApplicationController
  before_action :set_project, only: %i[index create]
  before_action :set_task, only: %i[show update destroy]

  has_scope :by_query
  has_scope :by_status
  has_scope :by_sort, using: %i[column direction], type: :hash

  # GET /admin/projects/:project_id/tasks
  def index
    @tasks = apply_scopes(@project.tasks).paginate(page: params[:page])

    render json: @tasks,
           meta: pagination_dict(@tasks),
           adapter: :json,
           root: 'entries'
  end

  # GET /admin/tasks/1
  def show
    render json: @task
  end

  # POST /admin/projects/:project_id/tasks
  def create
    @task = @project.tasks.create!(task_params)

    render json: @task, status: :created
  end

  # PATCH/PUT /admin/tasks/1
  def update
    @task.update!(task_params)

    render json: @task
  end

  # DELETE /admin/tasks/1
  def destroy
    @task.destroy
  end

  private

  def set_project
    @project = policy_scope(Project).find(params[:project_id])
  end

  def set_task
    @task = policy_scope(Task).find(params[:id])
    authorize @task
  end

  def task_params
    params.fetch(:task, {}).permit(
      :summary,
      :description,
      :status,
      :assigned_to
    )
  end
end
