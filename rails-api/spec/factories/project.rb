FactoryBot.define do
  factory :project do
    name { Faker::Name.unique.name }
    created_by factory: :user
  end
end
