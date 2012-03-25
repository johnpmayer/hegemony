
{-# OPTIONS -Wall #-}

{-# LANGUAGE
    GADTs,
    DataKinds, 
    FlexibleInstances,
    FlexibleContexts,
    TypeFamilies #-}

{-# LANGUAGE UndecidableInstances #-}

module Nat where

data N = Z | S N

-- | Convenience Types

type D0 = Z
type D1 = S D0
type D2 = S D1
type D3 = S D2
type D4 = S D3
type D5 = S D4
type D6 = S D5

-- | Strict ordering constraints for annotated types

data LT_N :: N -> N -> * where
  LT_Z :: LT_N Z (S n)
  LT_S :: LT_N n1 n2 -> LT_N (S n1) (S n2)

class LT ltn where
  lt :: ltn

instance LT (LT_N Z (S n)) where
  lt = LT_Z

instance LT (LT_N n1 n2) => LT (LT_N (S n1) (S n2)) where
  lt = LT_S lt

restricted :: a 
restricted = error "Not permitted by type"

-- | Type-level operations on 'N

type family ADD (n1 :: N) (n2 :: N) :: N
type instance ADD Z n = n
type instance ADD (S n1) n2 = S (ADD n1 n2)

type family SUB (n1 :: N) (n2 :: N) :: N
type instance SUB n Z = n
type instance SUB (S n1) (S n2) = SUB n1 n2

type family MUL (n1 :: N) (n2 :: N) :: N
type instance MUL Z n = Z
type instance MUL (S n1) n2 = ADD n2 (MUL n1 n2)

-- | Annotated analogous of standard typeclasses

class MonoidA m where
  mempty :: m Z
  mappend :: m n1 -> m n2 -> m (ADD n1 n2)

-- | Annotated natural numbers

data Nat :: N -> * where 
  Ze :: Nat Z
  Su :: Nat n -> Nat (S n)

intVal :: Nat n -> Int
intVal Ze     = 0
intVal (Su n) = 1 + intVal n

addNat :: Nat n1 -> Nat n2 -> Nat (ADD n1 n2)
addNat Ze n = n
addNat (Su n1) n2 = Su $ addNat n1 n2

instance Show (Nat n) where
  show = show . intVal

instance MonoidA Nat where
  mempty = Ze
  mappend = addNat
