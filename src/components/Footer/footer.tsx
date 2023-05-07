import { useState } from 'react'
import Logo from '../Header/logo'

export default function Footer(){
    const [navbarOpen,setNavbarOpen] = useState(false)
    const [submenuOpen,setSubmenuOpen] = useState(false)
    const [scrolledFromTop,setScrolledFromTop] = useState(false)
    return(
        <footer className="mt-0 bg-bg-color pt-24">
          <div className="container">
            <div className="-mx-4 flex flex-wrap">
              <div className="w-full px-4 sm:w-6/12 lg:w-3/12 xl:w-4/12">
                <div className="mb-16">
                  <div className="max-w-[300px]">
                  <div className="flex items-center mb-6">

                   <Logo />
                    </div>
                    <p
                      className="mb-6 text-base font-medium text-body-color"
                    >
 3D Printing For The Sharing Economy                   </p>
    
                    <div className="flex items-center">
                      <a
                        href="javascript:void(0)"
                        
                        aria-label="social-link"
                        className="social-link mr-5 text-white hover:text-primary"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          className="fill-current"
                        >
                          <path
                            d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.5701C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
                          />
                        </svg>
                      </a>
                      <a
                        href="javascript:void(0)"
                        
                        aria-label="social-link"
                        className="social-link mr-5 text-white hover:text-primary"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          className="fill-current"
                        >
                          <path
                            d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.27998 9.09 5.10998 7.38 2.99998 4.79C2.62998 5.42 2.41998 6.16 2.41998 6.94C2.41998 8.43 3.16998 9.75 4.32998 10.5C3.61998 10.5 2.95998 10.3 2.37998 10C2.37998 10 2.37998 10 2.37998 10.03C2.37998 12.11 3.85998 13.85 5.81998 14.24C5.45998 14.34 5.07998 14.39 4.68998 14.39C4.41998 14.39 4.14998 14.36 3.88998 14.31C4.42998 16 5.99998 17.26 7.88998 17.29C6.42998 18.45 4.57998 19.13 2.55998 19.13C2.21998 19.13 1.87998 19.11 1.53998 19.07C3.43998 20.29 5.69998 21 8.11998 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z"
                          />
                        </svg>
                      </a>
                      <a
                        href="javascript:void(0)"
                        
                        aria-label="social-link"
                        className="social-link mr-5 text-white hover:text-primary"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          className="fill-current"
                        >
                          <path
                            d="M19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19ZM18.5 18.5V13.2C18.5 12.3354 18.1565 11.5062 17.5452 10.8948C16.9338 10.2835 16.1046 9.94 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17C14.6813 12.17 15.0374 12.3175 15.2999 12.5801C15.5625 12.8426 15.71 13.1987 15.71 13.57V18.5H18.5ZM6.88 8.56C7.32556 8.56 7.75288 8.383 8.06794 8.06794C8.383 7.75288 8.56 7.32556 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19C6.43178 5.19 6.00193 5.36805 5.68499 5.68499C5.36805 6.00193 5.19 6.43178 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56ZM8.27 18.5V10.13H5.5V18.5H8.27Z"
                          />
                        </svg>
                      </a>
                      <a
                        href="javascript:void(0)"
                        
                        aria-label="social-link"
                        className="social-link mr-5 text-white hover:text-primary"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          className="fill-current"
                        >
                          <path
                            d="M10 15L15.19 12L10 9V15ZM21.56 7.17C21.69 7.64 21.78 8.27 21.84 9.07C21.91 9.87 21.94 10.56 21.94 11.16L22 12C22 14.19 21.84 15.8 21.56 16.83C21.31 17.73 20.73 18.31 19.83 18.56C19.36 18.69 18.5 18.78 17.18 18.84C15.88 18.91 14.69 18.94 13.59 18.94L12 19C7.81 19 5.2 18.84 4.17 18.56C3.27 18.31 2.69 17.73 2.44 16.83C2.31 16.36 2.22 15.73 2.16 14.93C2.09 14.13 2.06 13.44 2.06 12.84L2 12C2 9.81 2.16 8.2 2.44 7.17C2.69 6.27 3.27 5.69 4.17 5.44C4.64 5.31 5.5 5.22 6.82 5.16C8.12 5.09 9.31 5.06 10.41 5.06L12 5C16.19 5 18.8 5.16 19.83 5.44C20.73 5.69 21.31 6.27 21.56 7.17Z"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
    
              <div className="w-full px-4 sm:w-6/12 lg:w-3/12 xl:w-3/12">
                <div className="mb-16">
                  <h2 className="mb-8 text-2xl font-bold text-white">
                    Company
                  </h2>
    
                  <ul>
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="mb-4 inline-block text-base font-medium text-body-color transition hover:text-white"
                      >
                        About company
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="mb-4 inline-block text-base font-medium text-body-color transition hover:text-white"
                      >
                        Company services
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="mb-4 inline-block text-base font-medium text-body-color transition hover:text-white"
                      >
                        Job opportunities
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="mb-4 inline-block text-base font-medium text-body-color transition hover:text-white"
                      >
                        Contact us
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
    
              <div className="w-full px-4 sm:w-6/12 lg:w-3/12 xl:w-2/12">
                <div className="mb-16">
                  <h2 className="mb-8 text-2xl font-bold text-white">
                    Customer
                  </h2>
    
                  <ul>
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="mb-4 inline-block text-base font-medium text-body-color transition hover:text-white"
                      >
                        Client support
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="mb-4 inline-block text-base font-medium text-body-color transition hover:text-white"
                      >
                        Latest news
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="mb-4 inline-block text-base font-medium text-body-color transition hover:text-white"
                      >
                        Company Details
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="mb-4 inline-block text-base font-medium text-body-color transition hover:text-white"
                      >
                        Who we are
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
    
              <div className="w-full px-4 sm:w-6/12 lg:w-3/12 xl:w-3/12">
                <div className="mb-16">
                  <h2 className="mb-8 text-2xl font-bold text-white">
                    Subscribe Now
                  </h2>
    
                  <p className="mb-5 text-base font-medium text-body-color">
                    Enter your email address for receiving valuable newsletters.
                  </p>
    
                  <form className="relative">
                    <input
                      type="email"
                      name="newslettersEmail"
                      placeholder="Enter your email address"
                      className="h-12 w-full rounded-lg border border-stroke bg-transparent pl-5 pr-10 text-sm font-medium text-white outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      name="submit"
                      aria-label="submit"
                      className="absolute right-[6px] top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-primary text-white"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        className="fill-current"
                      >
                        <path
                          d="M1.66669 17.5L19.1667 10L1.66669 2.5V8.33333L14.1667 10L1.66669 11.6667V17.5Z"
                        />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
    
            <div className="border-t border-stroke">
              <div className="py-7 text-center">
                <p className="text-base font-medium text-body-color">
                  &copy; Copyright {new Date().getFullYear()} - 3D Print Near Me, All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
)}    
