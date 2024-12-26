import React from 'react';

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container">
        <div className="row py-3 align-items-center">
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <img src="/logo.png?height=40&width=40" alt="Centennial Infotech Logo" className="me-3" style={{height: '40px', width: '40px'}} />
              <h1 className="h4 mb-0 d-none d-sm-block">Centennial Infotech</h1>
              <h1 className="h4 mb-0 d-sm-none">CI</h1>
            </div>
          </div>
          <div className="col-auto ms-auto">
            <nav className="d-flex align-items-center">
              <div className="dropdown">
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                  <li><a className="dropdown-item" href="#">Profile</a></li>
                  <li><hr className="dropdown-divider" /></li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

