
{-# OPTIONS -Wall #-}

{-# LANGUAGE
    DataKinds,
    UndecidableInstances,
    FlexibleContexts,
    TypeFamilies #-}

module Geodesic where

import qualified Prelude as P
import Prelude hiding (foldr)

import Nat
import LIV
import Vector

type family ULen (n :: N) :: N
type instance ULen n = ADD D1 (MUL D6 n)

type family VLen (n :: N) :: N
type instance VLen n = ADD D1 (MUL D5 n)

data Node = Node

data Geodesic n a = Geo { u_array :: U_Array n a }

newtype U_Array n a = U (LIV (ULen n) (LIV (VLen n) a)) deriving Show

fillU :: (Fillable (ULen n), Fillable (VLen n)) => a -> U_Array n a
fillU = U . fill . fill

icosahedron :: Geodesic D1 (Maybe Vect3)
icosahedron = Geo $ boundaryScan (ico_u_array :: U_Array D1 (Maybe Vect3))

boundaryScan :: U_Array n a -> U_Array n a
boundaryScan = undefined

replace2 :: (LT (LT_N n1 n3), LT (LT_N n2 n4)) =>
            Nat n1 -> Nat n2 -> a -> LIV n3 (LIV n4 a) -> LIV n3 (LIV n4 a)
replace2 n1 n2 x liv = new1 where
  new1 = replace n1 new2 old1
  new2 = replace n2 x old2
  old1 = liv
  old2 = liv ! n1

north :: Vect3
north = V3 . (Cons 0) . (Cons 1) . (Cons 0) $ Nil

south :: Vect3
south = V3 . (Cons 0) . (Cons (-1)) . (Cons 0) $ Nil

ico_u_array :: U_Array D1 (Maybe Vect3)
ico_u_array = replace d0 d1 north $
              (fillU Nothing :: U_Array D1 (Maybe Vect3))
