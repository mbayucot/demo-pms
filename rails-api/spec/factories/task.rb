FactoryBot.define do
  factory :task do
    summary { Faker::Lorem.sentence }
    description { Faker::Lorem.sentence }
    status { Faker::Number.within(range: 0..2) }
    association :project
    association :user
  end
end
