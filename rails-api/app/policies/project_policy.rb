class ProjectPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def create?
    !user.staff?
  end

  def update?
    true
  end

  def destroy?
    !user.staff?
  end

  class Scope < Scope
    def resolve
      user.client? ? scope.where(created_by: user.id) : scope.all
    end
  end
end
