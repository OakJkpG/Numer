import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  padding: 10px;
  background-color: gray;
  display: flex;
  gap: 20px;
  color: white;
`;

const Navbar = () => (
  <NavbarContainer>
    <Link to="/">Home</Link>
    <Link to="/root-finding">Root Finder</Link>
    <Link to="/linear-finder">Cramer's Rule</Link>
  </NavbarContainer>
);

export default Navbar;
