import { useEffect, useState } from 'react';

export default function AuthForm({ isLogin: initialIsLogin, onClose, onSuccess }) {
  const [isLoginInternal, setIsLoginInternal] = useState(initialIsLogin);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const signInImgUrl = 'https://tinyurl.com/zmvhwzn9';   
  const signUpImgUrl = 'https://tinyurl.com/mrxtwp8e';   


  const currentImage = isLoginInternal ? signInImgUrl : signUpImgUrl;

  useEffect(() => {
    setIsLoginInternal(initialIsLogin);
  }, [initialIsLogin]);

  const toggleMode = (isLogin) => {
    setIsLoginInternal(isLogin);
    setUsername('');
    setPassword('');
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const endpoint = isLoginInternal ? '/api/login/' : '/api/register/';

    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();
      const data = text.length ? JSON.parse(text) : {};

      if (res.ok) {
        setErrors({});
        if (isLoginInternal) {
          localStorage.setItem('access', data.access);
          localStorage.setItem('refresh', data.refresh);
          onSuccess();
          
        } else {
          setModalMessage('Registration successful! Please log in.');
          setShowModal(true);
          toggleMode(true);
        }
      } else {
        setErrors(data);
      }
    } catch (err) {
      setErrors({
        non_field_errors: [
          err.message.startsWith('Unexpected token')
            ? 'Invalid server response'
            : err.message
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex items-center justify-center">
      <div className="w-full h-full md:h-auto md:max-w-7xl bg-white rounded-none md:rounded-2xl shadow-xl overflow-hidden flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">

          {/* Image Section */}
          <div className="hidden md:flex items-center justify-center p-12 h-full relative">
            <img
              src={currentImage}
              alt={isLoginInternal ? 'Sign In Illustration' : 'Sign Up Illustration'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form Section */}
          <div className="p-6 md:p-12 h-full flex flex-col overflow-y-auto relative">
            <div className="flex gap-4 mb-8">
              <button
                type="button"
                onClick={() => toggleMode(true)}
                className={`text-xl font-semibold pb-2 ${
                  isLoginInternal
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => toggleMode(false)}
                className={`text-xl font-semibold pb-2 ${
                  !isLoginInternal
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
              {errors.non_field_errors && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {errors.non_field_errors.map((msg, i) => (
                    <p key={i}>{msg}</p>
                  ))}
                </div>
              )}

              {/* Username */}
              <div>
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors(prev => ({ ...prev, username: undefined }));
                  }}
                />
                {errors.username && (
                  <ul className="mt-1 text-red-500 text-sm list-disc list-inside">
                    {errors.username.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                />
                {errors.password && (
                  <ul className="mt-1 text-red-500 text-sm list-disc list-inside">
                    {errors.password.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
              >
                {isLoading
                  ? 'Processing...'
                  : isLoginInternal
                    ? 'Sign In'
                    : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-center">{modalMessage}</h2>
            <button
              onClick={() => {
                setShowModal(false);
                onClose();
              }}
              className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
