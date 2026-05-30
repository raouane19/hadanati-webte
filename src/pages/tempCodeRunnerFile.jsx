      navigate('/account-verification');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="nursery-container">
      <div className="nursery-box">