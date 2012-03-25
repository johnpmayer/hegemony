
{-# OPTIONS -Wall #-}

{-# LANGUAGE
    DataKinds,
    UndecidableInstances,
    TypeFamilies #-}

module Geodesic where

import Nat
import LIV

type family ULen (n :: N) :: N
type instance ULen n = ADD D1 (MUL D6 n)

type family VLen (n :: N) :: N
type instance VLen n = ADD D1 (MUL D5 n)

data Node = Node

data Geodesic n = Geo { u_array :: LIV (ULen n) (LIV (VLen n) Node) }




