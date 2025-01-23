import React, { useState } from 'react';
import axios from 'axios';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import {
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  Fade,
  Slide,
} from '@mui/material';
import { Upload as UploadIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  //@ts-ignore
  boxShadow: theme.shadows ? theme.shadows[4] : 'none',
}));


const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  //@ts-ignore
  boxShadow: theme.shadows[5], 
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: theme.spacing(7),
  height: theme.spacing(7),
}));

const cache = createCache({ key: 'css' });

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://pdf-parser-7mnz.onrender.com/api/parse-resume/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setParsedData(response.data);
    } catch (error: any) {
      setError('Error uploading file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CacheProvider value={cache}>
    <Container maxWidth="md">
      <Fade in={true} timeout={1000}>
        <StyledPaper elevation={3}>
          <Grid container spacing={4} alignItems="center">
            <Grid item>
              <StyledAvatar>
                <UploadIcon fontSize="large" />
              </StyledAvatar>
            </Grid>
            <Grid item>
              <Typography variant="h4" component="h1" gutterBottom>
                File Parser
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Upload your file to extract key information.
              </Typography>
            </Grid>
          </Grid>
          <Divider style={{ margin: '24px 0' }} />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <input
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  color="primary"
                  component="span"
                  startIcon={<DescriptionIcon />}
                  fullWidth
                >
                  Choose File
                </Button>
              </label>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={loading || !file}
                fullWidth
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Uploading...' : 'Upload file'}
              </Button>
            </Grid>
          </Grid>
          {loading && <LinearProgress style={{ marginTop: '16px' }} />}
        </StyledPaper>
      </Fade>

      {error && (
        <Slide direction="down" in={!!error} mountOnEnter unmountOnExit>
          <Alert severity="error" style={{ marginBottom: '16px' }}>
            {error}
          </Alert>
        </Slide>
      )}

      {parsedData && (
        <Fade in={true} timeout={1000}>
          <StyledCard>
            <CardHeader
              avatar={
                <Avatar aria-label="file" style={{ backgroundColor: '#4caf50' }}>
                  R
                </Avatar>
              }
              title="Parsed file Data"
              subheader="Extracted information from your file"
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText primary="Name" secondary={parsedData.name} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemText primary="Phone" secondary={parsedData.phone} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemText primary="Address" secondary={parsedData.address} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemText primary="Links" secondary={parsedData.links.join(', ')} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemText primary="Skills" secondary={parsedData.skills.join(', ')} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemText primary="Experience" secondary={parsedData.experience.join(', ')} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemText primary="Education" secondary={parsedData.education.join(', ')} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemText primary="Achievements" secondary={parsedData.achievements.join(', ')} />
                </ListItem>
              </List>
            </CardContent>
          </StyledCard>
        </Fade>
      )}
    </Container>
    </CacheProvider>
  );
};

export default App;