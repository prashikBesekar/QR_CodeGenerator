import React from 'react';

const PricingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        'Up to 10 QR codes',
        'Basic customization',
        'Standard support',
        'PNG download',
        'Basic analytics'
      ],
      popular: false,
      buttonText: 'Current Plan',
      buttonClass: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      features: [
        'Unlimited QR codes',
        'Advanced customization',
        'Detailed analytics & tracking',
        'Multiple formats (PNG, SVG, PDF)',
        'Priority support',
        'API access',
        'Custom domains',
        'Bulk operations'
      ],
      popular: true,
      buttonText: 'Upgrade to Pro',
      buttonClass: 'bg-blue-600 text-white hover:bg-blue-700'
    },
    {
      name: 'Enterprise',
      price: '$29.99',
      period: '/month',
      features: [
        'Everything in Pro',
        'Team collaboration (up to 10 users)',
        'White-label solution',
        'Custom integrations',
        'Advanced security features',
        'Dedicated account manager',
        'SLA guarantee',
        'On-premise deployment option'
      ],
      popular: false,
      buttonText: 'Contact Sales',
      buttonClass: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Choose Your Plan</h2>
              <p className="text-gray-600 mt-1">Upgrade to unlock more features and capabilities</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-lg p-6 relative ${
                  plan.popular 
                    ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${plan.buttonClass}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">All plans include:</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>✓ SSL Security</span>
              <span>✓ 99.9% Uptime</span>
              <span>✓ Mobile App</span>
              <span>✓ Email Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PricingModal;