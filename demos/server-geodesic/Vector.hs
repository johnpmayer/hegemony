
module Vector where

import Nat
import LIV

newtype Vect3 = V3 { unVect3 :: LIV D3 Double } deriving Show

{-
x, y, z :: Vect3 -> Double
x = (! d0) . unVect3
y = (! d1) . unVect3
z = (! d2) . unVect3
-}

