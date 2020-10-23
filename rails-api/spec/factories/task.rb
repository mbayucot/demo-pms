FactoryBot.define do
  factory :task do
    summary { Faker::Lorem.sentence }
    description { Faker::Lorem.sentence }
    status { Faker::Number.within(range: 0..2) }
    project
    assigned_to factory: :user
  end
end
