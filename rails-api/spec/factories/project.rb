FactoryBot.define do
  factory :project do
    name { Faker::Name.unique.name }
    association :user
  end
end
